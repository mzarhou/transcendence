import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateProfile(
    activeUser: ActiveUserData,
    updateUserDto: UpdateUserDto,
  ) {
    const noUpdate = Object.keys(updateUserDto).every((k) => !updateUserDto[k]);
    if (noUpdate) {
      return this.usersRepository.findOneOrThrow(activeUser.sub);
    }
    const updatedUser = await this.usersRepository.update(
      activeUser.sub,
      updateUserDto,
    );
    return updatedUser;
  }

  async findFriend(user: ActiveUserData, friendId: number) {
    const friend = await this.usersRepository.findOneOrThrow(friendId, {
      includeFriends: true,
    });

    const isFriend =
      friend.friends.findIndex((frd) => frd.id === user.sub) > -1;
    if (!isFriend) {
      throw new NotFoundException();
    }

    return friend;
  }

  async findOne(userId: number) {
    return this.usersRepository.findOneOrThrow(userId);
  }

  async isUserBlocked(user1Id: number, user2Id: number) {
    if (user1Id === user2Id) return false;
    const { blockedUsers, blockingUsers } =
      await this.usersRepository.findOneOrThrow(user1Id, {
        includeBlockedUsers: true,
        includeBlockingUsers: true,
      });
    const ids = [...blockedUsers, ...blockingUsers].map((u) => u.id);
    return ids.includes(user2Id);
  }
}
