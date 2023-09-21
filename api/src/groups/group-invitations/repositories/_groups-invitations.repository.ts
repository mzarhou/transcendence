import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GroupWithUsers } from '@src/+prisma/helpers';

export interface CreateGroupInvitation {
  userId: number;
  groupId: number;
  invitedById: number;
}

export type GroupInvitationWithGroup = Prisma.GroupInvitationGetPayload<{
  include: { group: true };
}>;

@Injectable()
export abstract class GroupsInvitationsRepository {
  abstract createInvitation(
    data: CreateGroupInvitation,
  ): Promise<GroupInvitationWithGroup>;

  abstract findGroupWithUsers(groupId: number): Promise<GroupWithUsers>;
}
