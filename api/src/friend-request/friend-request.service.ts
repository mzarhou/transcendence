import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { Prisma } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { FRIEND_REQUEST_EVENT } from '@transcendence/common';
import { FRIEND_REQUEST_ACCEPTED_EVENT } from '@transcendence/common';
import { FriendRequest } from '@transcendence/common';
import { FriendRequestWithRequester } from '@transcendence/common';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    user: ActiveUserData,
    createFriendRequestDto: CreateFriendRequestDto,
  ) {
    const { targetUserId } = createFriendRequestDto;
    if (targetUserId === user.sub) {
      throw new BadRequestException(
        "You can't send friend request to your self",
      );
    }

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

    const createdFriendRequest = await this.prisma.friendRequest.create({
      data: {
        recipientId: targetUserId,
        requesterId: user.sub,
      },
      include: {
        requester: true,
      },
    });
    this.notificationsService.notify(
      [targetUserId],
      FRIEND_REQUEST_EVENT,
      createdFriendRequest,
    );
  }

  findSent(user: ActiveUserData, includeRecipient: boolean = true) {
    return this.prisma.friendRequest.findMany({
      where: {
        requesterId: user.sub,
      },
      include: {
        recipient: includeRecipient,
      },
    });
  }

  async findRecieved(user: ActiveUserData, includeRequester: boolean = true) {
    const friendRequest = await this.prisma.friendRequest.findMany({
      where: {
        recipientId: user.sub,
      },
      include: {
        requester: includeRequester,
      },
    });
    return friendRequest satisfies (FriendRequest &
      FriendRequestWithRequester)[];
  }

  async findOne(id: number) {
    const targetFriendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        id,
      },
    });

    if (!targetFriendRequest) {
      throw new NotFoundException('friend request not found');
    }
    return targetFriendRequest;
  }

  async remove(id: number) {
    await this.prisma.friendRequest.delete({
      where: {
        id,
      },
    });
  }

  async accept(id: number, user: ActiveUserData) {
    try {
      const acceptedFriendRequest =
        await this.prisma.friendRequest.findFirstOrThrow({
          where: { id },
          include: { recipient: true },
        });

      const {
        id: friendRequestId,
        requesterId,
        recipientId,
      } = acceptedFriendRequest;

      if (recipientId !== user.sub) {
        throw new ForbiddenException('You can not accept this friend request');
      }

      // add user as friend
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: requesterId },
          data: {
            friends: {
              connect: { id: recipientId },
            },
          },
        }),
        this.prisma.user.update({
          where: { id: recipientId },
          data: {
            friends: {
              connect: { id: requesterId },
            },
          },
        }),
        this.prisma.friendRequest.delete({
          where: { id: friendRequestId },
        }),
      ]);

      this.notificationsService.notify(
        [requesterId],
        FRIEND_REQUEST_ACCEPTED_EVENT,
        acceptedFriendRequest,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('invalid friend request');
      }
      throw error;
    }
  }
}
