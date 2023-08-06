import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import {
  GroupWithBlockedUsers,
  GroupWithMessages,
  GroupWithOwner,
  GroupWithPassword,
  GroupWithUsers,
  UserGroupRole,
} from '@transcendence/common';
import { UpdateGroupDto } from '../dto/update-group.dto';

export type MakePropsUndefined<T> = {
  [P in keyof T]: undefined;
};

export type GroupsFindOneOrThrow = <
  A extends false | true = false,
  B extends false | true = false,
  C extends false | true = false,
  D extends false | true = false,
>(
  id: number,
  options?: {
    includeBlockedUsers?: A;
    includeMessages?: B;
    includeUsers?: C;
    includeOwner?: D;
  },
) => Promise<
  | (GroupWithPassword &
      (A extends true
        ? GroupWithBlockedUsers
        : MakePropsUndefined<GroupWithBlockedUsers>)) &
      (B extends true
        ? GroupWithMessages
        : MakePropsUndefined<GroupWithMessages>) &
      (C extends true ? GroupWithUsers : MakePropsUndefined<GroupWithUsers>) &
      (D extends true ? GroupWithOwner : MakePropsUndefined<GroupWithOwner>)
>;

export type GroupsFindOne = (
  ...args: Parameters<GroupsFindOneOrThrow>
) => Promise<Awaited<ReturnType<GroupsFindOneOrThrow>> | null>;

@Injectable()
export abstract class GroupsRepository {
  omitPassword<T extends { password: string | null | undefined }>(group: T) {
    const { password, ...rest } = group;
    return rest;
  }

  abstract create({
    name,
    status,
    password,
    ownerId,
  }: CreateGroupDto & {
    ownerId: number;
  }): Promise<GroupWithPassword>;

  abstract findOne: GroupsFindOne;
  abstract findOneOrThrow: GroupsFindOneOrThrow;

  abstract update(
    args: UpdateGroupDto & { groupId: number },
  ): Promise<GroupWithPassword>;

  abstract destroy(groupId: number): Promise<GroupWithPassword>;

  abstract updateUserRole(args: {
    groupId: number;
    userId: number;
    newRole: UserGroupRole;
  }): Promise<{ role: UserGroupRole }>;

  abstract banUser(args: {
    groupId: number;
    userId: number;
  }): Promise<GroupWithPassword>;

  abstract unbanUser(args: {
    groupId: number;
    userId: number;
  }): Promise<GroupWithPassword>;

  abstract removeUser(args: { groupId: number; userId: number });
  abstract addUser({ groupId, userId }: { groupId: number; userId: number });
  abstract leaveGroup({
    newOwnerId,
    groupId,
    userId,
  }: {
    newOwnerId?: number;
    groupId: number;
    userId: number;
  });

  abstract findUserGroups(
    userId: number,
  ): Promise<(GroupWithPassword & { role: UserGroupRole })[]>;

  abstract searchGroups(
    searchTerm: string,
  ): Promise<(GroupWithPassword & GroupWithBlockedUsers)[]>;
}
