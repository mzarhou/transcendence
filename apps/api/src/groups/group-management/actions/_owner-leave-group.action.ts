import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  ADD_ADMIN_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
  LEAVE_GROUP_NOTIFICATION,
} from '@transcendence/db';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { OwnerLeaveGroupDto } from '../dto/owner-leave-group.dto';

@Injectable()
export class OwnerLeaveGroupAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly notificationService: NotificationsService,
  ) {}

  async execute(
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
}
