import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_NOTIFICATION_PAYLOAD,
  GROUP_UNBANNED_NOTIFICATION,
} from '@transcendence/db';
import { Injectable } from '@nestjs/common';
import { UnBanUserDto } from '../dto/ban-user/unban-user.dto';

@Injectable()
export class UnbanUserAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
