import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserWithFriends } from '@transcendence/common';
import { MakePropsUndefined } from 'src/groups/repositories/_goups.repository';
import { UserWithSecrets } from '@transcendence/common';
import { CreateUserDto } from '../dto/create-user.dto';

export type UsersFindOneOrThrow = <A extends boolean, B extends boolean>(
  id: number,
  options?: {
    includeFriends?: A;
    includeSecrets?: B;
  },
) => Promise<
  User &
    (A extends true ? UserWithFriends : MakePropsUndefined<UserWithFriends>) &
    (B extends true ? UserWithSecrets : MakePropsUndefined<UserWithSecrets>)
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
}
