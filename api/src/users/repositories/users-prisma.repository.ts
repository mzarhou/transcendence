import { PrismaService } from 'src/prisma/prisma.service';
import { UsersFindOneOrThrow, UsersRepository } from './users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@transcendence/common';
import { NotFoundException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersPrismaRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async update(userId: number, data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
      },
    });
    return updatedUser;
  }

  findOneOrThrow: UsersFindOneOrThrow = (async (id, options) => {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        friends: !!options?.includeFriends,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return new Promise((resolve) =>
      resolve(user),
    ) satisfies ReturnType<UsersFindOneOrThrow>;
  }) as UsersFindOneOrThrow;
}
