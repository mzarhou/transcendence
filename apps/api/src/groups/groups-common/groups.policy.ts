import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Group,
  GroupWithBlockedUsers,
  GroupWithUsers,
} from '@transcendence/db';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsMutedUsersStorage } from './groups-muted-users.storage';
import { BaseGroupsPolicy } from './base-groups.policy';

@Injectable()
export class GroupsPolicy extends BaseGroupsPolicy {
  constructor(private readonly mutedUsersStorage: GroupsMutedUsersStorage) {
    super();
  }

  canRead(user: ActiveUserData, group: Group & GroupWithUsers) {
    if (this.isMember(user.sub, group)) return true;
    throw new ForbiddenException('You can not read group info');
  }

  canDelete(user: ActiveUserData, group: Group) {
    if (this.isOwner(user.sub, group)) return true;
    throw new ForbiddenException('You can not delete the group');
  }

  canUpdate(user: ActiveUserData, group: Group) {
    if (this.isOwner(user.sub, group)) return true;
    throw new ForbiddenException('You can not update the group');
  }

  canAddAdmin(user: ActiveUserData, group: Group) {
    if (this.isOwner(user.sub, group)) return true;
    throw new ForbiddenException('You can not add an admin');
  }

  canRemoveAdmin(user: ActiveUserData, group: Group) {
    if (this.isOwner(user.sub, group)) return true;
    throw new ForbiddenException('You can not remove an admin');
  }

  canBanUser({
    user,
    group,
    targetUserId,
  }: {
    user: ActiveUserData;
    group: Group & GroupWithUsers;
    targetUserId: number;
  }) {
    if (user.sub === targetUserId)
      throw new ForbiddenException('You can not ban your self');

    if (this.isAdmin(targetUserId, group)) {
      return this.requireOwner(user.sub, group, 'You can not ban an admin');
    }
    return this.requireAdmin(user.sub, group, 'You can not ban a user');
  }

  canUnbanUser({
    user,
    group,
    targetUserId,
  }: {
    user: ActiveUserData;
    group: Group & GroupWithUsers;
    targetUserId: number;
  }) {
    if (this.isOwnerOrAdmin(user, group)) return true;

    try {
      this.canBanUser({ user, group, targetUserId });
    } catch (error) {
      throw new ForbiddenException('You can not Unban a user');
    }
  }

  canKickUser({
    user,
    group,
    targetUserId,
  }: {
    user: ActiveUserData;
    group: Group & GroupWithUsers;
    targetUserId: number;
  }) {
    if (user.sub === targetUserId)
      throw new ForbiddenException('You can not kick your self');

    if (this.isAdmin(targetUserId, group)) {
      return this.requireOwner(user.sub, group, 'You can not kick an admin');
    }
    return this.requireAdmin(user.sub, group, 'You can not kick a user');
  }

  canJoinGroup(user: ActiveUserData, group: Group & GroupWithBlockedUsers) {
    const isUserBlocked = !!group.blockedUsers.find((u) => u.id === user.sub);
    if (isUserBlocked) throw new ForbiddenException('You are banned');
    return true;
  }

  canLeaveGroup(user: ActiveUserData, group: Group & GroupWithUsers) {
    return this.requireMember(user.sub, group, 'You are not a member');
  }

  async canSendMessage(user: ActiveUserData, group: Group & GroupWithUsers) {
    this.canRead(user, group);
    const isMuted = await this.mutedUsersStorage.isUserMuted({
      userId: user.sub,
      groupId: group.id,
    });
    if (isMuted) {
      throw new ForbiddenException('You are muted');
    }
    return true;
  }

  canMuteUser(data: {
    user: ActiveUserData;
    group: Group & GroupWithUsers;
    targetUserId: number;
  }) {
    return this.canBanUser(data);
  }
}
