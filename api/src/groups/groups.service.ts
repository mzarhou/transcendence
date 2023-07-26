import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddGroupAdminDto } from './dto/group-admin/add-group-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { BanUserDto } from './dto/ban-user/ban-user.dto';
import { Group } from '@prisma/client';
import { RemoveGroupAdminDto } from './dto/group-admin/remove-group-admin.dto';
import {
  GroupWithBlockedUsers,
  GroupWithUsers,
  UserGroup,
} from './group.types';
import { UnBanUserDto } from './dto/ban-user/unban-user.dto';
import { KickUserDto } from './dto/kick-user.dto';

@ApiTags('groups')
@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user: ActiveUserData,
    { name, status, password }: CreateGroupDto,
  ) {
    await this.prisma.$transaction([
      this.prisma.group.create({
        data: {
          name,
          ownerId: user.sub,
          avatar: 'https://api.dicebear.com/6.x/identicon/svg?seed=' + name,
          status,
          password: status === 'PROTECTED' ? password : undefined,
        },
      }),
      this.prisma.group.update({
        where: { name },
        data: {
          users: {
            create: {
              userId: user.sub,
              role: 'ADMIN',
            },
          },
        },
      }),
    ]);
  }

  async findOne(
    id: number,
    options?: {
      includeBlockedUsers?: boolean;
      includeMessages?: boolean;
      includeUsers?: boolean;
      includeOwner?: boolean;
    },
  ) {
    const group = await this.prisma.group.findFirst({
      where: { id },
      include: {
        blockedUsers: options?.includeBlockedUsers,
        messages: options?.includeMessages,
        owner: options?.includeOwner,
        users: options?.includeUsers,
      },
    });

    if (!group) throw new NotFoundException();
    return group;
  }

  async findGroupUsers(groupId: number) {
    const usersOnGroups = await this.prisma.usersOnGroups.findMany({
      where: { groupId },
      include: {
        user: true,
      },
    });
    return usersOnGroups.map((ug) => ({
      ...ug.user,
      role: ug.role,
    })) satisfies UserGroup[];
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    await this.prisma.group.update({
      where: { id },
      data: {
        ...updateGroupDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.group.delete({
      where: { id },
    });
  }

  async addGroupAdmin(
    group: GroupWithBlockedUsers,
    { userId: targetUserId }: AddGroupAdminDto,
  ) {
    const isUserBlocked = group.blockedUsers.find(
      (user) => user.id === targetUserId,
    );
    if (isUserBlocked) {
      throw new BadRequestException('user is blocked');
    }

    await this.prisma.usersOnGroups.update({
      where: { userId_groupId: { groupId: group.id, userId: targetUserId } },
      data: {
        role: 'ADMIN',
      },
    });
  }

  async removeGroupAdmin(group: Group, { userId }: RemoveGroupAdminDto) {
    await this.prisma.usersOnGroups.update({
      where: { userId_groupId: { groupId: group.id, userId } },
      data: {
        role: 'MEMBER',
      },
    });
  }

  async banUser({ id: groupId }: Group, { userId: targetUserId }: BanUserDto) {
    await this.prisma.$transaction([
      /**
       * add user to blocked users
       */
      this.prisma.group.update({
        where: { id: groupId },
        data: {
          blockedUsers: { connect: { id: targetUserId } },
        },
      }),
      /**
       * remove user
       */
      this.prisma.usersOnGroups.delete({
        where: { userId_groupId: { groupId: groupId, userId: targetUserId } },
      }),
    ]);
  }

  async unbanUser(group: Group, { userId: targetUserId }: UnBanUserDto) {
    await this.prisma.group.update({
      where: { id: group.id },
      data: {
        blockedUsers: { disconnect: { id: targetUserId } },
      },
    });
  }

  async kickUser(groupId: number, { userId }: KickUserDto) {
    await this.prisma.usersOnGroups.delete({
      where: { userId_groupId: { groupId, userId } },
    });
  }

  isUserAdmin(userId: number, group: GroupWithUsers) {
    return !!group.users.find((u) => u.userId === userId && u.role === 'ADMIN');
  }

  async joinGroup(user: ActiveUserData, group: Group) {
    await this.prisma.group.update({
      where: { id: group.id },
      data: {
        users: {
          create: {
            userId: user.sub,
          },
        },
      },
    });
  }

  async leaveGroup(user: ActiveUserData, group: Group) {
    await this.prisma.usersOnGroups.delete({
      where: {
        userId_groupId: {
          userId: user.sub,
          groupId: group.id,
        },
      },
    });
  }
}
