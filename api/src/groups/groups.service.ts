import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { AddGroupAdminDto } from './dto/group-admin/add-group-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { BanUserDto } from './dto/ban-user/ban-user.dto';
import { RemoveGroupAdminDto } from './dto/group-admin/remove-group-admin.dto';
import { UnBanUserDto } from './dto/ban-user/unban-user.dto';
import { KickUserDto } from './dto/kick-user.dto';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  ADD_ADMIN_NOTIFICATION,
  GROUP_BANNED_NOTIFICATION,
  GROUP_DELETED_NOTIFICATION,
  GROUP_KICKED_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
  GROUP_UNBANNED_NOTIFICATION,
  Group,
  JOIN_GROUP_NOTIFICATION,
  LEAVE_GROUP_NOTIFICATION,
  REMOVE_ADMIN_NOTIFICATION,
  UserGroupRole,
} from '@transcendence/common';
import { HashingService } from '@src/iam/hashing/hashing.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { OwnerLeaveGroupDto } from './dto/owner-leave-group.dto';
import { GroupUsersFilterDto } from './dto/group-users-filter-query.dto';
import { GroupsRepository } from './repositories/_groups.repository';
import { GroupsPolicy } from './groups.policy';
import { GroupWithUsers } from '@transcendence/common';
import { MuteUserDto } from './dto/mute-user.dto';
import { GroupsMutedUsersStorage } from './groups-muted-users.storage';
import { UsersService } from '@src/users/users.service';

@ApiTags('groups')
@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
    private readonly hashingService: HashingService,
    private readonly mutedUsersStorage: GroupsMutedUsersStorage,
  ) {}

  async create(
    user: ActiveUserData,
    { name, status, password }: CreateGroupDto,
  ) {
    const groupPassword =
      status === 'PROTECTED'
        ? await this.hashingService.hash(password!)
        : undefined;

    const createdGroup = await this.groupsRepository.create({
      name,
      status,
      password: groupPassword,
      ownerId: user.sub,
    });
    return this.groupsRepository.omitPassword(createdGroup) satisfies Group;
  }

  async update(
    user: ActiveUserData,
    groupId: number,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId);
    this.groupsPolicy.canUpdate(user, group);

    if (updateGroupDto.status === 'PROTECTED' && !updateGroupDto.password) {
      throw new BadRequestException('You must set a group password');
    }

    const updatedGroup = await this.groupsRepository.update({
      ...updateGroupDto,
      groupId,
    });
    return this.groupsRepository.omitPassword(updatedGroup);
  }

  async remove(user: ActiveUserData, groupId: number) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canDelete(user, group);

    const deletedGroup = await this.groupsRepository.destroy(groupId);

    const groupUsersIds = group.users.map((u) => u.id);
    await this.notificationService.notify(
      groupUsersIds,
      GROUP_DELETED_NOTIFICATION,
      {
        message: `group ${deletedGroup.name} deleted`,
        groupId: deletedGroup.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );

    return this.groupsRepository.omitPassword(deletedGroup);
  }

  async addGroupAdmin(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: AddGroupAdminDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeBlockedUsers: true,
    });
    this.groupsPolicy.canAddAdmin(user, group);

    const isUserBlocked = group.blockedUsers.find(
      (user) => user.id === targetUserId,
    );
    if (isUserBlocked) {
      throw new BadRequestException('user is blocked');
    }

    const updatedGroup = await this.groupsRepository.updateUserRole({
      groupId: group.id,
      userId: targetUserId,
      newRole: 'ADMIN',
    });
    await this.notificationService.notify(
      [targetUserId],
      ADD_ADMIN_NOTIFICATION,
      {
        message: `You ${group.name} role changed to admin`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );
    return { role: updatedGroup.role };
  }

  async removeGroupAdmin(
    user: ActiveUserData,
    groupId: number,
    { userId }: RemoveGroupAdminDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId);
    this.groupsPolicy.canRemoveAdmin(user, group);

    await this.groupsRepository.updateUserRole({
      userId,
      groupId: group.id,
      newRole: 'MEMBER',
    });

    await this.notificationService.notify([userId], REMOVE_ADMIN_NOTIFICATION, {
      message: `You ${group.name} role changed to member`,
      groupId: group.id,
    } satisfies GROUP_NOTIFICATION_PAYLOAD);
    return { success: true };
  }

  async banUser(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: BanUserDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canBanUser({ user, group, targetUserId });

    await this.notificationService.notify(
      [targetUserId],
      GROUP_BANNED_NOTIFICATION,
      {
        message: `You've been unbanned from ${group.name} group`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );

    const updatedGroup = await this.groupsRepository.banUser({
      groupId: group.id,
      userId: targetUserId,
    });
    return this.groupsRepository.omitPassword(updatedGroup);
  }

  async unbanUser(
    user: ActiveUserData,
    groupId: number,
    { userId: targetUserId }: UnBanUserDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeBlockedUsers: true,
      includeUsers: true,
    });

    this.groupsPolicy.canUnbanUser({ user, group, targetUserId });

    const updateGroup = await this.groupsRepository.unbanUser({
      groupId: group.id,
      userId: targetUserId,
    });
    await this.notificationService.notify(
      [targetUserId],
      GROUP_UNBANNED_NOTIFICATION,
      {
        message: `You've been unbanned from ${group.name} group, you can now join the group`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );
    return this.groupsRepository.omitPassword(updateGroup);
  }

  async kickUser(
    user: ActiveUserData,
    groupId: number,
    { userId }: KickUserDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canKickUser({ user, group, targetUserId: userId });

    await this.groupsRepository.removeUser({ groupId: group.id, userId });
    await this.notificationService.notify([userId], GROUP_KICKED_NOTIFICATION, {
      message: `You've been kicked out from ${group.name} group`,
      groupId: group.id,
    } satisfies GROUP_NOTIFICATION_PAYLOAD);
    return this.groupsRepository.omitPassword(group);
  }

  async joinGroup(
    user: ActiveUserData,
    groupId: number,
    joinGroupDto?: JoinGroupDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeBlockedUsers: true,
    });

    this.groupsPolicy.canJoinGroup(user, group);

    if (group.status === 'PRIVATE') {
      // TODO: implement invitations for private groups
      throw new ForbiddenException('You can not join the group');
    }

    const password = joinGroupDto?.password;
    if (
      group.status === 'PROTECTED' &&
      !(await this.hashingService.compare(password ?? '', group.password!))
    ) {
      throw new ForbiddenException('Invalid password');
    }

    await this.groupsRepository.addUser({
      groupId: group.id,
      userId: user.sub,
    });
    await this.notificationService.notify([user.sub], JOIN_GROUP_NOTIFICATION, {
      message: `You've joined ${group.name} group!`,
      groupId: group.id,
    } satisfies GROUP_NOTIFICATION_PAYLOAD);
    return this.groupsRepository.omitPassword(group);
  }

  async leaveGroup(user: ActiveUserData, groupId: number) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });
    if (group.ownerId === user.sub) {
      throw new ForbiddenException('Invalid route');
    }
    this.groupsPolicy.canLeaveGroup(user, group);
    await this.groupsRepository.leaveGroup({
      userId: user.sub,
      groupId: group.id,
    });
    await this.notificationService.notify(
      [user.sub],
      LEAVE_GROUP_NOTIFICATION,
      {
        message: `You've left ${group.name} group!`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );
    return { success: true };
  }

  async ownerLeaveGroup(
    user: ActiveUserData,
    groupId: number,
    { newOwnerId }: OwnerLeaveGroupDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });
    if (group.ownerId !== user.sub) {
      throw new ForbiddenException('Invalid route');
    }
    try {
      if (user.sub === newOwnerId) {
        throw new Error('Invalid new owner');
      }
      this.groupsPolicy.canRead({ sub: newOwnerId } as ActiveUserData, group);
    } catch (error) {
      throw new ForbiddenException('Invalid new owner');
    }
    await this.groupsRepository.leaveGroup({
      userId: user.sub,
      groupId: group.id,
      newOwnerId,
    });
    await this.notificationService.notify(
      [user.sub],
      LEAVE_GROUP_NOTIFICATION,
      {
        message: `You've left ${group.name} group!`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );
    await this.notificationService.notify(
      [newOwnerId],
      ADD_ADMIN_NOTIFICATION,
      {
        message: `Your are now owner of ${group.name} group!`,
        groupId: group.id,
      } satisfies GROUP_NOTIFICATION_PAYLOAD,
    );
    return { success: true };
  }

  async search(user: ActiveUserData, term: any) {
    const userGroups = await this.findUserGroups(user);
    if (!term || term.length === 0) {
      return [];
    }

    const groups = await this.groupsRepository.searchGroups(term);

    // remove private & blocking groups
    return groups
      .filter(
        (g) =>
          g.status !== 'PRIVATE' &&
          !g.blockedUsers.find((bu) => bu.id === user.sub),
      )
      .map((g) => {
        const roleInGroup = userGroups.find((u) => u.id === g.id)?.role;
        return {
          ...this.groupsRepository.omitPassword(g),
          role: roleInGroup,
          blockedUsers: undefined,
        };
      });
  }

  async findUserGroups(user: ActiveUserData) {
    const groups = await this.groupsRepository.findUserGroups(user.sub);
    return groups.map((g) => this.groupsRepository.omitPassword(g));
  }

  async showGroup(user: ActiveUserData, groupId: number) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canRead(user, group);
    const role = group.users.find((u) => u.id === user.sub)!.role;

    return {
      ...group,
      role,
    } satisfies Group &
      GroupWithUsers & {
        role: UserGroupRole;
      };
  }

  async findGroupById(groupId: number) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });
    return group;
  }

  async findGroupUsers(
    user: ActiveUserData,
    groupId: number,
    { filter }: GroupUsersFilterDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
      includeBlockedUsers: filter === 'banned',
    });

    this.groupsPolicy.canRead(user, group);

    if (filter === 'banned') {
      return group.blockedUsers;
    }
    if (filter === 'admins') {
      return group.users.filter((u) => u.role === 'ADMIN');
    }
    if (filter === 'members') {
      return group.users.filter((u) => u.role === 'MEMBER');
    }
    return group.users;
  }

  async muteUser(
    user: ActiveUserData,
    groupId: number,
    muteUserDto: MuteUserDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canMuteUser({
      user,
      targetUserId: muteUserDto.userId,
      group,
    });

    await this.mutedUsersStorage.add({
      userId: muteUserDto.userId,
      groupId,
      time: muteUserDto.period,
    });
    return { success: true };
  }
}
