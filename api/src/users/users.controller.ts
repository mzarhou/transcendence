import { Controller, Get, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@ActiveUser('sub') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  async updateProfile(
    @ActiveUser() currentUser: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser, updateUserDto);
  }

  @Get('friends')
  async findFriends(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findFriends(user);
  }
}
