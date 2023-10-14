import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_KICKED_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
} from '@transcendence/db';
import { Injectable } from '@nestjs/common';
import { KickUserDto } from '../dto/kick-user.dto';

@Injectable()
export class KickUserAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
