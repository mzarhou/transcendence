import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateProfile(
    activeUser: ActiveUserData,
    updateUserDto: UpdateUserDto,
  ) {
    const noUpdate = Object.keys(updateUserDto).every((k) => !updateUserDto[k]);
    if (noUpdate) {
      return this.findOne(activeUser.sub);
    }
    await this.userRepository.update(
      { id: activeUser.sub },
      {
        name: updateUserDto.name,
        avatar: updateUserDto.avatar,
      },
    );
    return this.findOne(activeUser.sub);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    const { tfaSecret, school42Id, ...rest } = user;
    return rest;
  }
}
