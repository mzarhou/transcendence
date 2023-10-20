import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_NOTIFICATION_PAYLOAD,
  JOIN_GROUP_NOTIFICATION,
} from '@transcendence/db';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JoinGroupDto } from '../dto/join-group.dto';
import { HashingService } from '@src/iam/hashing/hashing.service';

@Injectable()
export class JoinGroupAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
    private readonly hashingService: HashingService,
  ) {}

  async execute(
    user: ActiveUserData,
    groupId: number,
    joinGroupDto?: JoinGroupDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeBlockedUsers: true,
    });

    this.groupsPolicy.canJoinGroup(user, group);

    if (group.status === 'PRIVATE') {
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
}
