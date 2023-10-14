import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@src/iam/authentication/enum/auth-type.enum';
import { CurrentUser } from '@transcendence/db';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(AuthType.BearerWithou2fa)
  @Get('me')
  async me(@ActiveUser() user: ActiveUserData) {
    const data = await this.usersService.findOne(user.sub);
    return {
      ...data,
      isTfaCodeProvided: user.isTfaCodeProvided,
    } satisfies CurrentUser;
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
