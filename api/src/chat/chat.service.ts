import { HttpStatus, Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestService } from './friend-request/friend-request.service';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WebsocketException } from './ws.exception';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly friendRequestService: FriendRequestService,
    private readonly authService: AuthenticationService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    try {
      const cookies = parse(socket.handshake.headers.cookie ?? '');
      let accessToken: string | undefined = cookies['accessToken'];

      const headers = socket.handshake.headers;
      accessToken ??= headers.authorization?.split(' ')[1];

      const user = await this.authService.getUserFromToken(accessToken ?? '');
      return user;
    } catch (error) {
      throw new WebsocketException({
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  async isFriendOf(user: ActiveUserData, targetUserId: number) {
    const user1Friends = await this.findFriends(user);
    const isFriends =
      user1Friends.findIndex((frd) => frd.id === targetUserId) > -1;
    return isFriends;
  }

  async findFriends(activeUser: ActiveUserData) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: activeUser.sub },
      include: {
        friends: true,
      },
    });
    return currentUser.friends;
  }

  async search(user: ActiveUserData, searchTerm: string) {
    if (searchTerm.length === 0) {
      return [];
    }

    const friends = await this.findFriends(user);
    const sentFriendRequests = await this.friendRequestService.findSent(
      user,
      false,
    );
    const receivedFriendRequests = await this.friendRequestService.findRecieved(
      user,
      false,
    );

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: [user.sub],
        },
        name: {
          contains: searchTerm,
        },
      },
    });

    return users.map((u) => {
      const isFriend = friends.findIndex((frd) => frd.id === u.id) > -1;
      const sentFrIndex = sentFriendRequests.findIndex(
        (fr) => fr.recipientId === u.id,
      );
      const receivedFrIndex = receivedFriendRequests.findIndex(
        (fr) => fr.requesterId === u.id,
      );
      const sentFrId =
        sentFrIndex > -1 ? sentFriendRequests[sentFrIndex].id : null;
      const receivedFrId =
        receivedFrIndex > -1
          ? receivedFriendRequests[receivedFrIndex].id
          : null;

      return { ...u, isFriend, sentFrId, receivedFrId };
    });
  }

  async unfriend(targetUserId: number, user: ActiveUserData) {
    await this.prisma.$transaction(
      this.unfriendTransactions(targetUserId, user),
    );
  }

  private unfriendTransactions(targetUserId: number, user: ActiveUserData) {
    return [
      this.prisma.user.update({
        where: { id: user.sub },
        data: {
          friends: {
            disconnect: { id: targetUserId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: targetUserId },
        data: {
          friends: {
            disconnect: { id: user.sub },
          },
        },
      }),
    ];
  }

  async blockUser(user: ActiveUserData, targetUserId: number) {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { recipientId: user.sub, requesterId: targetUserId },
          { recipientId: targetUserId, requesterId: user.sub },
        ],
      },
      select: { id: true },
    });

    await this.prisma.$transaction([
      // remove friend request if exists
      ...(friendRequest
        ? [
            this.prisma.friendRequest.delete({
              where: { id: friendRequest.id },
            }),
          ]
        : []),

      // unfriend
      ...this.unfriendTransactions(targetUserId, user),

      // add target user to blocked users
      this.prisma.user.update({
        where: { id: user.sub },
        data: {
          blockedUsers: {
            connect: { id: targetUserId },
          },
        },
      }),
    ]);
  }

  async unblockUser(user: ActiveUserData, targetUserId: number) {
    await this.prisma.user.update({
      where: { id: user.sub },
      data: {
        blockedUsers: {
          disconnect: { id: targetUserId },
        },
      },
    });
  }

  async findBlockedUsers(activeUser: ActiveUserData) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: activeUser.sub },
      include: {
        blockedUsers: true,
      },
    });
    return currentUser.blockedUsers;
  }
}
