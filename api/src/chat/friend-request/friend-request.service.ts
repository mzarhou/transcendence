import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

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
    await this.prisma.friendRequest.create({
      data: {
        recipientId: targetUserId,
        requesterId: user.sub,
      },
    });
  }

  findSent(user: ActiveUserData) {
    return this.prisma.friendRequest.findMany({
      where: {
        requesterId: user.sub,
      },
      include: {
        recipient: true,
      },
    });
  }

  findRecieved(user: ActiveUserData) {
    return this.prisma.friendRequest.findMany({
      where: {
        recipientId: user.sub,
      },
      include: {
        requester: true,
      },
    });
  }

  findAll() {
    return `This action returns all friendRequest`;
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

  async remove(id: number, user: ActiveUserData) {
    const targetFriendRequest = await this.findOne(id);
    if (targetFriendRequest.requesterId !== user.sub) {
      throw new UnauthorizedException();
    }
    await this.prisma.friendRequest.delete({
      where: {
        id,
      },
    });
  }
}
