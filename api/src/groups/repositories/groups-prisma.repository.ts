import { PrismaService } from 'src/prisma/prisma.service';
import {
  GroupsFindOne,
  GroupsFindOneOrThrow,
  GroupsRepository,
} from './_goups.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import {
  GroupWithBlockedUsers,
  GroupWithPassword,
  UserGroupRole,
} from '@transcendence/common';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Injectable()
export class GroupsPrismaRepository extends GroupsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create({
    name,
    status,
    password,
    ownerId,
  }: CreateGroupDto & { ownerId: number }): Promise<GroupWithPassword> {
    const [createdGroup] = await this.prisma.$transaction([
      this.prisma.group.create({
        data: {
          name,
          ownerId,
          avatar: 'https://api.dicebear.com/6.x/identicon/svg?seed=' + name,
          status,
          password,
        },
      }),
      this.prisma.group.update({
        where: { name },
        data: {
          users: {
            create: {
              userId: ownerId,
              role: 'ADMIN',
            },
          },
        },
      }),
    ]);
    return createdGroup;
  }

  findOne: GroupsFindOne = (async (id, options) => {
    const group = await this.prisma.group.findFirst({
      where: { id },
      include: {
        blockedUsers: !!options?.includeBlockedUsers,
        messages: !!options?.includeMessages,
        owner: !!options?.includeOwner,
        users: { include: { user: true } },
      },
    });

    if (!group) return null;

    return new Promise((resolve) =>
      resolve({
        ...group,
        users: group.users.map((u) => ({ ...u.user, role: u.role })),
      }),
    ) satisfies ReturnType<GroupsFindOne>;
  }) as GroupsFindOne;

  findOneOrThrow: GroupsFindOneOrThrow = (async (id, options) => {
    const group = await this.findOne(id, options);
    if (!group) throw new NotFoundException('group not found');
    return new Promise((resolve) =>
      resolve(group),
    ) satisfies ReturnType<GroupsFindOneOrThrow>;
  }) as GroupsFindOneOrThrow;

  async update({
    name,
    status,
    password,
    groupId,
  }: UpdateGroupDto & { groupId: number }): Promise<GroupWithPassword> {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        status,
        password: status === 'PROTECTED' ? password : undefined,
      },
    });
  }

  destroy(groupId: number): Promise<GroupWithPassword> {
    return this.prisma.group.delete({
      where: { id: groupId },
    });
  }

  async updateUserRole(args: {
    groupId: number;
    userId: number;
    newRole: UserGroupRole;
  }): Promise<{ role: UserGroupRole }> {
    const result = await this.prisma.usersOnGroups.update({
      where: { userId_groupId: { groupId: args.groupId, userId: args.userId } },
      data: {
        role: args.newRole,
      },
    });
    return { role: result.role };
  }

  async banUser({
    groupId,
    userId,
  }: {
    groupId: number;
    userId: number;
  }): Promise<GroupWithPassword> {
    const [, updatedGroup] = await this.prisma.$transaction([
      /**
       * remove user from group
       */
      this.prisma.usersOnGroups.delete({
        where: { userId_groupId: { groupId: groupId, userId } },
      }),
      /**
       * add user to blocked users
       */
      this.prisma.group.update({
        where: { id: groupId },
        data: {
          blockedUsers: { connect: { id: userId } },
        },
      }),
    ]);

    return updatedGroup;
  }

  async unbanUser({
    groupId,
    userId,
  }: {
    groupId: number;
    userId: number;
  }): Promise<GroupWithPassword> {
    const updatedGroup = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        blockedUsers: { disconnect: { id: userId } },
      },
    });

    return updatedGroup;
  }

  async removeUser({ groupId, userId }: { groupId: number; userId: number }) {
    return this.prisma.usersOnGroups.delete({
      where: { userId_groupId: { groupId, userId } },
    });
  }

  async addUser({ groupId, userId }: { groupId: number; userId: number }) {
    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        users: {
          create: {
            userId: userId,
          },
        },
      },
    });
  }

  async leaveGroup({
    newOwnerId,
    groupId,
    userId,
  }: {
    newOwnerId?: number;
    groupId: number;
    userId: number;
  }) {
    await this.prisma.$transaction([
      ...(!!newOwnerId
        ? [
            this.prisma.group.update({
              where: { id: groupId },
              data: { ownerId: newOwnerId },
            }),
          ]
        : []),
      this.prisma.usersOnGroups.delete({
        where: {
          userId_groupId: {
            userId: userId,
            groupId: groupId,
          },
        },
      }),
    ]);
  }

  async findUserGroups(
    userId: number,
  ): Promise<(GroupWithPassword & { role: UserGroupRole })[]> {
    const data = await this.prisma.usersOnGroups.findMany({
      where: { userId },
      include: {
        group: true,
      },
    });
    return data.map((gu) => ({ ...gu.group, role: gu.role }));
  }

  async searchGroups(
    searchTerm: string,
  ): Promise<(GroupWithPassword & GroupWithBlockedUsers)[]> {
    return this.prisma.group.findMany({
      where: {
        name: {
          contains: searchTerm,
        },
      },
      include: {
        blockedUsers: true,
      },
    });
  }
}
