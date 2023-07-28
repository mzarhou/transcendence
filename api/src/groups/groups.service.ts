import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  GROUP_DELETED_EVENT,
  GROUP_KICKED_EVENT,
  updateGroupSchema,
} from '@transcendence/common';
import { ADD_ADMIN_EVENT } from '@transcendence/common';
import { GROUP_BANNED_EVENT } from '@transcendence/common';
import { JOIN_GROUP_EVENT } from '@transcendence/common';
import { LEAVE_GROUP_EVENT } from '@transcendence/common';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { subject } from '@casl/ability';
import { JoinGroupDto } from './dto/join-group.dto';

@ApiTags('groups')
@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService,
    private readonly hashingService: HashingService,
  ) {}

  async create(
    user: ActiveUserData,
    { name, status, password }: CreateGroupDto,
  ) {
    const groupPassword =
      status === 'PROTECTED'
        ? await this.hashingService.hash(password!)
        : undefined;

    const [createdGroup, _] = await this.prisma.$transaction([
      this.prisma.group.create({
        data: {
          name,
          ownerId: user.sub,
          avatar: 'https://api.dicebear.com/6.x/identicon/svg?seed=' + name,
          status,
          password: groupPassword,
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
    return this.omitPassword(createdGroup);
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

  async update(
    user: ActiveUserData,
    groupId: number,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.findOne(groupId);
    user.allow('update', subject('Group', group));
    const updatedGroup = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...updateGroupDto,
      },
    });
    return this.omitPassword(updatedGroup);
  }

  async remove(user: ActiveUserData, groupId: number) {
    const group = await this.findOne(groupId);
    user.allow('delete', subject('Group', group));

    const groupUsersIds = (await this.findGroupUsers(groupId)).map((u) => u.id);
    const [, deletedGroup] = await this.prisma.$transaction([
      this.prisma.usersOnGroups.deleteMany({
        where: { groupId: groupId },
      }),
      this.prisma.group.delete({
        where: { id: groupId },
      }),
    ]);
    await this.notificationService.notify(
      groupUsersIds,
      GROUP_DELETED_EVENT,
      `group ${deletedGroup.name} deleted`,
    );
    return this.omitPassword(deletedGroup);
  }

  async addGroupAdmin(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: AddGroupAdminDto,
  ) {
    const group = await this.findOne(groupId, {
      includeBlockedUsers: true,
    });
    user.allow('add-admin', subject('Group', group));
    if (user.sub === targetUserId)
      throw new BadRequestException('You can not set your self admin');

    const isUserBlocked = group.blockedUsers.find(
      (user) => user.id === targetUserId,
    );
    if (isUserBlocked) {
      throw new BadRequestException('user is blocked');
    }

    const updatedUserGroup = await this.prisma.usersOnGroups.update({
      where: { userId_groupId: { groupId: group.id, userId: targetUserId } },
      data: {
        role: 'ADMIN',
      },
    });
    await this.notificationService.notify(
      [targetUserId],
      ADD_ADMIN_EVENT,
      `You ${group.name} role changed to admin`,
    );
    return updatedUserGroup;
  }

  async removeGroupAdmin(
    user: ActiveUserData,
    groupId: number,
    { userId }: RemoveGroupAdminDto,
  ) {
    const group = await this.findOne(groupId);
    user.allow('update', subject('Group', group), 'users.role');

    const updatedUserGroup = await this.prisma.usersOnGroups.update({
      where: { userId_groupId: { groupId: group.id, userId } },
      data: {
        role: 'MEMBER',
      },
    });
    await this.notificationService.notify(
      [userId],
      ADD_ADMIN_EVENT,
      `You ${group.name} role changed to member`,
    );
    return updatedUserGroup;
  }

  async banUser(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: BanUserDto,
  ) {
    const group = await this.findOne(groupId, {
      includeUsers: true,
    });

    if (this.isUserAdmin(targetUserId, group)) {
      user.allow('delete', subject('Group', group));
    } else {
      user.allow('ban-user', subject('Group', group));
    }

    const [_, updatedGroup] = await this.prisma.$transaction([
      /**
       * remove user
       */
      this.prisma.usersOnGroups.delete({
        where: { userId_groupId: { groupId: groupId, userId: targetUserId } },
      }),
      /**
       * add user to blocked users
       */
      this.prisma.group.update({
        where: { id: groupId },
        data: {
          blockedUsers: { connect: { id: targetUserId } },
        },
      }),
    ]);
    await this.notificationService.notify(
      [targetUserId],
      GROUP_BANNED_EVENT,
      `You've been unbanned from ${group.name} group`,
    );
    return this.omitPassword(updatedGroup);
  }

  async unbanUser(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: UnBanUserDto,
  ) {
    const group = await this.findOne(groupId, {
      includeBlockedUsers: true,
      includeUsers: true,
    });
    if (this.isUserAdmin(targetUserId, group)) {
      user.allow('delete', subject('Group', group));
    } else {
      user.allow('unban-user', subject('Group', group));
    }

    const updateGroup = await this.prisma.group.update({
      where: { id: group.id },
      data: {
        blockedUsers: { disconnect: { id: targetUserId } },
      },
    });
    await this.notificationService.notify(
      [targetUserId],
      GROUP_BANNED_EVENT,
      `You've been unbanned from ${group.name} group, you can now join the group`,
    );
    return this.omitPassword(updateGroup);
  }

  async kickUser(
    user: ActiveUserData,
    groupId: number,
    { userId }: KickUserDto,
  ) {
    const group = await this.findOne(groupId, {
      includeUsers: true,
    });
    const isTargetUserAdmin = this.isUserAdmin(userId, group);
    if (isTargetUserAdmin) {
      user.allow('delete', subject('Group', group), 'users.role');
    } else {
      user.allow('kick-user', subject('Group', group));
    }
    await this.prisma.usersOnGroups.delete({
      where: { userId_groupId: { groupId: group.id, userId } },
    });
    await this.notificationService.notify(
      [userId],
      GROUP_KICKED_EVENT,
      `You've been kicked out from ${group.name} group`,
    );
    return this.omitPassword(group);
  }

  isUserAdmin(userId: number, group: GroupWithUsers) {
    return !!group.users.find((u) => u.userId === userId && u.role === 'ADMIN');
  }

  async joinGroup(
    user: ActiveUserData,
    groupId: number,
    joinGroupDto?: JoinGroupDto,
  ) {
    const password = joinGroupDto?.password;
    const group = await this.findOne(groupId, {
      includeBlockedUsers: true,
    });

    user.allow('join', subject('Group', group));
    if (
      group.status === 'PRIVATE' ||
      (group.status === 'PROTECTED' &&
        !(await this.hashingService.compare(password ?? '', group.password!)))
    ) {
      throw new UnauthorizedException();
    }

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
    await this.notificationService.notify(
      [user.sub],
      JOIN_GROUP_EVENT,
      `You've joined ${group.name} group!`,
    );
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
    await this.notificationService.notify(
      [user.sub],
      LEAVE_GROUP_EVENT,
      `You've leaved ${group.name} group!`,
    );
  }

  private omitPassword<T extends { password: string | null | undefined }>(
    group: T,
  ) {
    const { password, ...rest } = group;
    return rest;
  }
}
