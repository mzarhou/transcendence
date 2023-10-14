import { Injectable } from '@nestjs/common';
import { IAction } from '@src/+common/action';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  GROUP_NOTIFICATION_PAYLOAD,
  REMOVE_ADMIN_NOTIFICATION,
} from '@transcendence/db';
import { RemoveGroupAdminDto } from '../dto/group-admin/remove-group-admin.dto';

@Injectable()
export class RemoveAdminAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
