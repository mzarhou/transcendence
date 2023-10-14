import { BadRequestException, Injectable } from '@nestjs/common';
import { IAction } from '@src/+common/action';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  ADD_ADMIN_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
} from '@transcendence/db';
import { AddGroupAdminDto } from '../dto/group-admin/add-group-admin.dto';

@Injectable()
export class AddAdminAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
