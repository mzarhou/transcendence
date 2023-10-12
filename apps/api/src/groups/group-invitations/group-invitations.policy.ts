import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { Prisma } from '@prisma/client';
import { BaseGroupsPolicy } from '../base-groups.policy';
import { GroupWithUsers, mapGroup } from '@src/+prisma/helpers';

type GroupInvitationWithUser = Prisma.GroupInvitationGetPayload<{
  include: {
    user: { select: { id: true } };
    group: {
      include: {
        users: {
          include: { user: true };
        };
      };
    };
  };
}>;

@Injectable()
export class GroupInvitationsPolicy extends BaseGroupsPolicy {
  canView(user: ActiveUserData, invitation: GroupInvitationWithUser): boolean {
    return this.canDelete(user, invitation);
  }

  /**
   * only admins can invite users to a group
   */
  canCreate(user: ActiveUserData, targetGroup: GroupWithUsers): boolean {
    return this.throwUnlessCan(this.isAdmin(user.sub, mapGroup(targetGroup)));
  }

  /**
   * invited user and group admins can Delete invitation
   */
  canDelete(
    user: ActiveUserData,
    invitation: GroupInvitationWithUser,
  ): boolean {
    return this.throwUnlessCan(
      user.sub === invitation.user.id || // is invited user
        this.isAdmin(user.sub, mapGroup(invitation.group)),
    );
  }

  /**
   * any member of the group can invite users
   */
  canInviteUsers(user: ActiveUserData, group: GroupWithUsers) {
    return this.requireMember(user.sub, mapGroup(group));
  }
}
