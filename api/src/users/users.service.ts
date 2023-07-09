import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
    activeUser: ActiveUserData,
    updateUserDto: UpdateUserDto,
  ) {
    const noUpdate = Object.keys(updateUserDto).every((k) => !updateUserDto[k]);
    if (noUpdate) {
      return this.findOne(activeUser.sub);
    }
    await this.prisma.user.update({
      where: { id: activeUser.sub },
      data: {
        name: updateUserDto.name,
        avatar: updateUserDto.avatar,
      },
    });
    return this.findOne(activeUser.sub);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    const { secretsId, ...rest } = user;
    return rest;
  }

  async findFriends(activeUser: ActiveUserData) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: activeUser.sub },
      include: {
        friends: true,
      },
    });
    return currentUser.friends;
  }
}
