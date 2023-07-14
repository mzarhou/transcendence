import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class FriendRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user: ActiveUserData,
    createFriendRequestDto: CreateFriendRequestDto,
  ) {
    const { targetUserId } = createFriendRequestDto;
    if (targetUserId === user.sub) {
      throw new BadRequestException();
    }

    const receivedFriendRequests = await this.findRecieved(user);
    const pendingFriendRequest =
      receivedFriendRequests.findIndex(
        (rfr) => rfr.requesterId === targetUserId,
      ) > -1;
    if (pendingFriendRequest) {
      throw new BadRequestException();
    }

    await this.prisma.friendRequest.create({
      data: {
        recipientId: targetUserId,
        requesterId: user.sub,
      },
    });
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

  findRecieved(user: ActiveUserData, includeRequester: boolean = true) {
    return this.prisma.friendRequest.findMany({
      where: {
        recipientId: user.sub,
      },
      include: {
        requester: includeRequester,
      },
    });
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
      const {
        id: friendRequestId,
        requesterId,
        recipientId,
      } = await this.prisma.friendRequest.findFirstOrThrow({ where: { id } });

      if (recipientId !== user.sub) {
        throw new UnauthorizedException();
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('invalid friend request');
      }
      throw error;
    }
  }
}
