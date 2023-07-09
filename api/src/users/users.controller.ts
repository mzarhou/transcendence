import { Controller, Get, Body, Patch, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { IdDto } from 'src/common/dto/id-param.dto';

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

  @Get('blocked')
  async findBlockedUsers(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findBlockedUsers(user);
  }

  @Post('/block/:id')
  blockUser(@Param() { id }: IdDto, @ActiveUser() activeUser: ActiveUserData) {
    return this.usersService.blockUser(activeUser, id);
  }

  @Post('/unblock/:id')
  unblockUser(
    @Param() { id }: IdDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.usersService.unblockUser(activeUser, id);
  }
}
