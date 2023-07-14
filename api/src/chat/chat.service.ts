import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestService } from './friend-request/friend-request.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

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
    await this.prisma.$transaction([
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
    ]);
  }

  async blockUser(user: ActiveUserData, targetUserId: number) {
    await this.unfriend(targetUserId, user);
    await this.prisma.user.update({
      where: { id: user.sub },
      data: {
        blockedUsers: {
          connect: { id: targetUserId },
        },
      },
    });
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
