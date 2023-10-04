import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GroupWithUsers } from '@src/+prisma/helpers';
import { UserGroupInvitation } from '@transcendence/db';

export interface CreateGroupInvitation {
  userId: number;
  groupId: number;
  invitedById: number;
}

export type GroupInvitationWithGroup = Prisma.GroupInvitationGetPayload<{
  include: { group: true; user: true };
}>;

export type SearchableGroup = Prisma.GroupGetPayload<{
  include: {
    users: { include: { user: true } };
    blockedUsers: true;
    invitations: true;
  };
}>;

@Injectable()
export abstract class GroupsInvitationsRepository {
  abstract createInvitation(
    data: CreateGroupInvitation,
  ): Promise<GroupInvitationWithGroup>;

  abstract findGroupWithUsers(groupId: number): Promise<GroupWithUsers | null>;

  abstract findSearchableGroup(
    groupId: number,
  ): Promise<SearchableGroup | null>;

  abstract findUserInvitations(userId: number): Promise<UserGroupInvitation[]>;
}
