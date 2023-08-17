import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpdateUserData,
  UsersFindOne,
  UsersFindOneOrThrow,
  UsersRepository,
} from './users.repository';
import { FriendRequest, User } from '@transcendence/common';
import { NotFoundException, Injectable } from '@nestjs/common';
import { UserWithSecrets } from '@transcendence/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersPrismaRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private unfriendTransactions(firstUserId: number, secondUserId: number) {
    return [
      this.prisma.user.update({
        where: { id: firstUserId },
        data: {
          friends: {
            disconnect: { id: secondUserId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: secondUserId },
        data: {
          friends: {
            disconnect: { id: firstUserId },
          },
        },
      }),
    ];
  }

  async unfriend(userId: number, targetUserId: number) {
    await this.prisma.$transaction(
      this.unfriendTransactions(userId, targetUserId),
    );
  }

  async unblockUser(userId: number, targetUserId: number) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
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
            disconnect: { id: userId },
          },
        },
      }),
    ]);
  }

  async blockUser(
    userId: number,
    targetUserId: number,
    friendRequest: FriendRequest | null,
  ) {
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
      ...this.unfriendTransactions(userId, targetUserId),

      // add target user to blocked users
      this.prisma.user.update({
        where: { id: userId },
        data: {
          blockedUsers: { connect: { id: targetUserId } },
        },
      }),
      this.prisma.user.update({
        where: { id: targetUserId },
        data: {
          blockingUsers: { connect: { id: userId } },
        },
      }),
    ]);
  }

  async update(userId: number, data: UpdateUserData): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        isTfaEnabled: data.isTfaEnabled,
        school42Id: data.school42Id,
        secrets: data.tfaSecret
          ? {
              update: {
                tfaSecret: data.tfaSecret,
              },
            }
          : undefined,
      },
    });
    return updatedUser;
  }

  findOneOrThrow: UsersFindOneOrThrow = (async (id, options) => {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        friends: !!options?.includeFriends,
        secrets: !!options?.includeSecrets,
        blockingUsers: !!options?.includeBlockingUsers,
        blockedUsers: !!options?.includeBlockedUsers,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return new Promise((resolve) =>
      resolve(user),
    ) satisfies ReturnType<UsersFindOneOrThrow>;
  }) as UsersFindOneOrThrow;

  findOne: UsersFindOne = async (id, options) => {
    try {
      const user = await this.findOneOrThrow(id, options);
      return user;
    } catch (error) {}
    return null;
  };

  async findOneBy(args: {
    email?: string;
    school42Id?: number;
  }): Promise<(User & UserWithSecrets) | null> {
    const user = await this.prisma.user.findFirst({
      where: args,
      include: {
        secrets: true,
      },
    });
    return user;
  }

  async create(data: CreateUserDto): Promise<User & UserWithSecrets> {
    const createdUser = await this.prisma.user.create({
      include: { secrets: true },
      data: {
        email: data.email,
        avatar: data.avatar,
        name: data.name,
        school42Id: data.school42Id,
        secrets: {
          create: {
            password: data.password,
          },
        },
      },
    });
    return createdUser;
  }

  async search({
    searchTerm,
    excludeUsersIds,
  }: {
    searchTerm: string;
    excludeUsersIds: number[];
  }): Promise<User[]> {
    const searchUsers = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: excludeUsersIds,
        },
        name: {
          contains: searchTerm,
        },
      },
    });
    return searchUsers;
  }
}
