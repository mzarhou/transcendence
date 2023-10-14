import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_NOTIFICATION_PAYLOAD,
  LEAVE_GROUP_NOTIFICATION,
} from '@transcendence/db';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class LeaveGroupAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(user: ActiveUserData, groupId: number) {
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
}
