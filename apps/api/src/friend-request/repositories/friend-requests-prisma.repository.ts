import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FriendRequestFindOneOrThrow,
  FriendRequestFindWhere,
  FriendRequestsRepository,
} from './_friend-requests.repository';
import {
  FriendRequest,
  FriendRequestWithRecipient,
  FriendRequestWithRequester,
} from '@transcendence/db';
import { PrismaService } from '@src/+prisma/prisma.service';

@Injectable()
export class FriendRequestsPrismaRepository extends FriendRequestsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(args: {
    recipientId: number;
    requesterId: number;
  }): Promise<FriendRequest & FriendRequestWithRequester> {
    const createdFriendRequest = await this.prisma.friendRequest.create({
      data: {
        recipientId: args.recipientId,
        requesterId: args.requesterId,
      },
      include: {
        requester: true,
      },
    });
    return createdFriendRequest;
  }

  findWhere: FriendRequestFindWhere = (async (args) => {
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        requesterId: args.requesterId,
        recipientId: args.recipientId,
      },
      include: {
        recipient: !!args.includeRecipient,
        requester: !!args.includeRequester,
      },
    });

    return new Promise((resolve) =>
      resolve(friendRequests),
    ) satisfies ReturnType<FriendRequestFindWhere>;
  }) as FriendRequestFindWhere;

  async findUsersFriendRequest(
    firstUserId: number,
    secondUserId: number,
  ): Promise<FriendRequest | null> {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { recipientId: firstUserId, requesterId: secondUserId },
          { recipientId: secondUserId, requesterId: firstUserId },
        ],
      },
    });
    return friendRequest;
  }

  findOneOrThrow: FriendRequestFindOneOrThrow = (async (id, options) => {
    const targetFriendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        id,
      },
      include: {
        requester: !!options?.includeRequester,
        recipient: !!options?.includeRecipient,
      },
    });

    if (!targetFriendRequest) {
      throw new NotFoundException('friend request not found');
    }
    return new Promise((resolve) =>
      resolve(targetFriendRequest),
    ) satisfies ReturnType<FriendRequestFindOneOrThrow>;
  }) as FriendRequestFindOneOrThrow;

  async destroy(id: number): Promise<FriendRequest> {
    return this.prisma.friendRequest.delete({
      where: {
        id,
      },
    });
  }

  async acceptFriendRequest(args: {
    friendRequestId: number;
    requesterId: number;
    recipientId: number;
  }): Promise<FriendRequest & FriendRequestWithRecipient> {
    const [, , acceptedFriendRequest] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: args.requesterId },
        data: {
          friends: {
            connect: { id: args.recipientId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: args.recipientId },
        data: {
          friends: {
            connect: { id: args.requesterId },
          },
        },
      }),
      this.prisma.friendRequest.delete({
        where: { id: args.friendRequestId },
        include: {
          recipient: true,
        },
      }),
    ]);

    return acceptedFriendRequest;
  }
}
