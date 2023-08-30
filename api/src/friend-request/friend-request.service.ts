import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { NotificationsService } from '@src/notifications/notifications.service';
import { FRIEND_REQUEST_EVENT } from '@transcendence/common';
import { FRIEND_REQUEST_ACCEPTED_EVENT } from '@transcendence/common';
import { FriendRequestsRepository } from './repositories/_friend-requests.repository';
import { FriendRequestPolicy } from './friend-request.policy';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly friendRequestsPolicy: FriendRequestPolicy,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    user: ActiveUserData,
    createFriendRequestDto: CreateFriendRequestDto,
  ) {
    const { targetUserId } = createFriendRequestDto;
    this.friendRequestsPolicy.canCreate(user, targetUserId);

    const receivedFriendRequests = await this.findRecieved(user);
    const pendingFriendRequest =
      receivedFriendRequests.findIndex(
        (rfr) => rfr.requesterId === targetUserId,
      ) > -1;
    if (pendingFriendRequest) {
      throw new BadRequestException(
        'You have a pending friend request from this user',
      );
    }

    const createdFriendRequest = await this.friendRequestsRepository.create({
      recipientId: targetUserId,
      requesterId: user.sub,
    });

    this.notificationsService.notify(
      [targetUserId],
      FRIEND_REQUEST_EVENT,
      createdFriendRequest,
    );
  }

  findSent(user: ActiveUserData, includeRecipient = true) {
    return this.friendRequestsRepository.findWhere({
      requesterId: user.sub,
      includeRecipient: includeRecipient,
    });
  }

  async findRecieved(user: ActiveUserData, includeRequester = true) {
    const friendRequests = await this.friendRequestsRepository.findWhere({
      recipientId: user.sub,
      includeRequester: includeRequester,
    });
    return friendRequests;
  }

  async remove(user: ActiveUserData, id: number) {
    const friendRequest = await this.friendRequestsRepository.findOneOrThrow(
      id,
    );
    this.friendRequestsPolicy.canDelete(user, friendRequest);
    await this.friendRequestsRepository.destroy(id);
  }

  async accept(user: ActiveUserData, id: number) {
    const friendRequest = await this.friendRequestsRepository.findOneOrThrow(
      id,
    );

    this.friendRequestsPolicy.canUpdate(user, {
      action: 'accept',
      friendRequest,
    });

    const acceptedFriendRequest =
      await this.friendRequestsRepository.acceptFriendRequest({
        friendRequestId: friendRequest.id,
        requesterId: friendRequest.requesterId,
        recipientId: friendRequest.recipientId,
      });

    this.notificationsService.notify(
      [friendRequest.requesterId],
      FRIEND_REQUEST_ACCEPTED_EVENT,
      acceptedFriendRequest,
    );
  }
}
