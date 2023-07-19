import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestService } from './friend-request/friend-request.service';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { FriendRequest, User } from '@prisma/client';
import { SearchUser } from '@transcendence/common';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

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

  async search(currentUser: ActiveUserData, searchTerm: string) {
    if (searchTerm.length === 0) return [];
    const [
      friends,
      sentFriendRequests,
      receivedFriendRequests,
      blockedUsers,
      blockingUsers,
    ] = await Promise.all([
      this.findFriends(currentUser),
      this.friendRequestService.findSent(currentUser, false),
      this.friendRequestService.findRecieved(currentUser, false),
      this.findBlockedUsers(currentUser),
      this.findBlockedUsers(currentUser),
    ]);

    const notIncludedIds = new Set(
      [...blockedUsers, ...blockingUsers].map((u) => u.id),
    );

    const searchUsers = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: [currentUser.sub, ...notIncludedIds],
        },
        name: {
          contains: searchTerm,
        },
      },
    });

    return Promise.all(
      searchUsers.map((targetUser) =>
        this.getSearchUser(targetUser, {
          friends,
          sentFriendRequests,
          receivedFriendRequests,
        }),
      ),
    );
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
          blockedUsers: { connect: { id: targetUserId } },
        },
      }),
      this.prisma.user.update({
        where: { id: targetUserId },
        data: {
          blockingUsers: { connect: { id: user.sub } },
        },
      }),
    ]);
  }

  async unblockUser(user: ActiveUserData, targetUserId: number) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.sub },
        data: {
          blockedUsers: {
            disconnect: { id: targetUserId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: targetUserId },
        data: {
          blockingUsers: {
            disconnect: { id: user.sub },
          },
        },
      }),
    ]);
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

  async findBlockingUsers(targetUserId: number) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: targetUserId },
      include: {
        blockingUsers: true,
      },
    });
    return currentUser.blockingUsers;
  }

  async findBlockedUsersByUserId(userId: number) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: {
        blockedUsers: true,
      },
    });
    return currentUser.blockedUsers;
  }

  private getFriendRequestId(
    friendRequests: FriendRequest[],
    where: (fr: FriendRequest) => boolean,
  ) {
    const index = friendRequests.findIndex(where);
    return index > -1 ? friendRequests[index].id : null;
  }

  private async getSearchUser(
    targetUser: User,
    {
      friends,
      sentFriendRequests,
      receivedFriendRequests,
    }: {
      friends: User[];
      sentFriendRequests: FriendRequest[];
      receivedFriendRequests: FriendRequest[];
    },
  ) {
    const isFriend = friends.findIndex((frd) => frd.id === targetUser.id) > -1;

    const sentFrId = this.getFriendRequestId(
      sentFriendRequests,
      (fr) => fr.recipientId === targetUser.id,
    );
    const receivedFrId = this.getFriendRequestId(
      receivedFriendRequests,
      (fr) => fr.requesterId === targetUser.id,
    );
    return {
      ...targetUser,
      isFriend,
      sentFrId,
      receivedFrId,
    } satisfies SearchUser;
  }
}
