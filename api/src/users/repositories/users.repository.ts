import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FriendRequest, User, UserWithFriends } from '@transcendence/common';
import { MakePropsUndefined } from 'src/groups/repositories/_goups.repository';
import { UserWithSecrets } from '@transcendence/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserWithBlockedUsers } from '@transcendence/common';
import { UserWithBlockingUsers } from '@transcendence/common';

export type UsersFindOneOrThrow = <
  A extends boolean,
  B extends boolean,
  C extends boolean,
  D extends boolean,
>(
  id: number,
  options?: {
    includeFriends?: A;
    includeSecrets?: B;
    includeBlockedUsers?: C;
    includeBlockingUsers?: D;
  },
) => Promise<
  User &
    (A extends true ? UserWithFriends : MakePropsUndefined<UserWithFriends>) &
    (B extends true ? UserWithSecrets : MakePropsUndefined<UserWithSecrets>) &
    (C extends true
      ? UserWithBlockedUsers
      : MakePropsUndefined<UserWithBlockedUsers>) &
    (D extends true
      ? UserWithBlockingUsers
      : MakePropsUndefined<UserWithBlockingUsers>)
>;

export type UsersFindOne = (
  ...args: Parameters<UsersFindOneOrThrow>
) => Promise<Awaited<ReturnType<UsersFindOneOrThrow>> | null>;

export type UpdateUserData = UpdateUserDto & {
  isTfaEnabled?: boolean;
  tfaSecret?: string;
  school42Id?: number;
};

@Injectable()
export abstract class UsersRepository {
  abstract update(userId: number, data: UpdateUserData): Promise<User>;
  abstract findOne: UsersFindOne;
  abstract findOneOrThrow: UsersFindOneOrThrow;
  abstract findOneBy(args: {
    email?: string;
    school42Id?: number;
  }): Promise<(User & UserWithSecrets) | null>;
  abstract create(data: CreateUserDto): Promise<User & UserWithSecrets>;
  abstract search(args: {
    searchTerm: string;
    excludeUsersIds: number[];
  }): Promise<User[]>;
  abstract unfriend(userId: number, targetUserId: number): Promise<void>;
  abstract unblockUser(userId: number, targetUserId: number): Promise<void>;
  abstract blockUser(
    userId: number,
    targetUserId: number,
    friendRequest: FriendRequest | null,
  ): Promise<void>;
}
