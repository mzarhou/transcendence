import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserWithFriends } from '@transcendence/common';
import { MakePropsUndefined } from 'src/groups/repositories/goups-base.repository';

export type UsersFindOneOrThrow = <A extends boolean>(
  id: number,
  options?: {
    includeFriends?: A;
  },
) => Promise<
  User &
    (A extends true ? UserWithFriends : MakePropsUndefined<UserWithFriends>)
>;

@Injectable()
export abstract class UsersRepository {
  abstract update(userId: number, data: UpdateUserDto): Promise<User>;
  abstract findOneOrThrow: UsersFindOneOrThrow;
}
