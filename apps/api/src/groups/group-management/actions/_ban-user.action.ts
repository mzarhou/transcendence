import { IAction } from '@src/+common/action';
import { BanUserDto } from '../dto/ban-user/ban-user.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_BANNED_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
} from '@transcendence/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BanUserAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
