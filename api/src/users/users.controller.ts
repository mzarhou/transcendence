import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findOne(user.sub);
  }

  @Get(':id')
  async user(@ActiveUser() user: ActiveUserData, @Param() params: IdDto) {
    return this.usersService.findFriend(user, params.id);
  }

  @Patch('me')
  async updateProfile(
    @ActiveUser() currentUser: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser, updateUserDto);
  }
}
