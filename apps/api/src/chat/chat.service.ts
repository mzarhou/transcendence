import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest, User } from '@prisma/client';
import {
  FRIEND_DISCONNECTED,
  FriendDisconnectedData,
  SearchUser,
} from '@transcendence/db';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { FriendRequestsRepository } from '@src/friend-request/repositories/_friend-requests.repository';
import { WebsocketService } from '@src/websocket/websocket.service';
import { UNFRIEND_EVENT } from '@transcendence/db';

@Injectable()
export class ChatService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly friendRequestService: FriendRequestService,
    private readonly websocketService: WebsocketService,
  ) {}

  async isFriendOf(user: ActiveUserData, targetUserId: number) {
    const user1Friends = await this.findFriends(user);
    const isFriends =
      user1Friends.findIndex((frd) => frd.id === targetUserId) > -1;
    return isFriends;
  }

  async findFriends(activeUser: ActiveUserData) {
    const currentUser = await this.usersRepository.findOneOrThrow(
      activeUser.sub,
      {
        includeFriends: true,
      },
    );
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

    const searchUsers = await this.usersRepository.search({
      searchTerm,
      excludeUsersIds: [currentUser.sub, ...notIncludedIds],
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
    await this.usersRepository.unfriend(user.sub, targetUserId);
    this.websocketService.addEvent([targetUserId], UNFRIEND_EVENT, {});
    this.websocketService.addEvent([targetUserId], FRIEND_DISCONNECTED, {
      friendId: user.sub,
    } satisfies FriendDisconnectedData);
    this.websocketService.addEvent([user.sub], FRIEND_DISCONNECTED, {
      friendId: targetUserId,
    } satisfies FriendDisconnectedData);
    return { success: true };
  }

  async blockUser(user: ActiveUserData, targetUserId: number) {
    const friendRequest =
      await this.friendRequestsRepository.findUsersFriendRequest(
        user.sub,
        targetUserId,
      );
    await this.usersRepository.blockUser(user.sub, targetUserId, friendRequest);
  }

  async unblockUser(user: ActiveUserData, targetUserId: number) {
    await this.usersRepository.unblockUser(user.sub, targetUserId);
  }

  async findBlockedUsers(activeUser: ActiveUserData) {
    const currentUser = await this.usersRepository.findOneOrThrow(
      activeUser.sub,
      {
        includeBlockedUsers: true,
      },
    );
    return currentUser.blockedUsers;
  }

  async findBlockingUsers(targetUserId: number) {
    const currentUser = await this.usersRepository.findOneOrThrow(
      targetUserId,
      {
        includeBlockingUsers: true,
      },
    );
    return currentUser.blockingUsers;
  }

  async findBlockedUsersByUserId(userId: number) {
    const currentUser = await this.usersRepository.findOneOrThrow(userId, {
      includeBlockedUsers: true,
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
