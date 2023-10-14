import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_DELETED_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
  Group,
  UserGroupRole,
} from '@transcendence/db';
import { HashingService } from '@src/iam/hashing/hashing.service';
import { GroupUsersFilterDto } from './dto/group-users-filter-query.dto';
import { GroupsRepository } from './groups-common/repositories/_groups.repository';
import { GroupsPolicy } from './groups-common/groups.policy';
import { GroupWithUsers } from '@transcendence/db';

@ApiTags('groups')
@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
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
}
