import { IdDto } from '@src/+common/dto/id-param.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  AddAdminAction,
  BanUserAction,
  JoinGroupAction,
  KickUserAction,
  LeaveGroupAction,
  MuteUserAction,
  OwnerLeaveGroupAction,
  RemoveAdminAction,
  UnbanUserAction,
} from './actions';
import {
  AddGroupAdminDto,
  BanUserDto,
  JoinGroupDto,
  KickUserDto,
  MuteUserDto,
  OwnerLeaveGroupDto,
  RemoveGroupAdminDto,
  UnBanUserDto,
} from './dto';

@Controller('/groups/:id')
export class GroupManagementController {
  constructor(
    private readonly addAdminAction: AddAdminAction,
    private readonly removeAdminAction: RemoveAdminAction,
    private readonly banUserAction: BanUserAction,
    private readonly unbanUserAction: UnbanUserAction,
    private readonly kickUserAction: KickUserAction,
    private readonly joinAction: JoinGroupAction,
    private readonly leaveAction: LeaveGroupAction,
    private readonly ownerLeaveAction: OwnerLeaveGroupAction,
    private readonly muteUserAction: MuteUserAction,
  ) {}

  @ApiOperation({ summary: 'Add an admin' })
  @HttpCode(HttpStatus.OK)
  @Post('add-admin')
  async addAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() addGroupAdminDto: AddGroupAdminDto,
  ) {
    return this.addAdminAction.execute(user, groupId, addGroupAdminDto);
  }

  @ApiOperation({ summary: 'Remove an admin (change its role to member)' })
  @HttpCode(HttpStatus.OK)
  @Post('remove-admin')
  async removeAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() removeGroupAdminDto: RemoveGroupAdminDto,
  ) {
    return this.removeAdminAction.execute(user, groupId, removeGroupAdminDto);
  }

  @ApiOperation({ summary: 'Ban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('ban-user')
  async banUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.banUserAction.execute(user, groupId, banUserDto);
  }

  @ApiOperation({ summary: 'Unban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('unban-user')
  async unBanUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() unbanUserDto: UnBanUserDto,
  ) {
    return this.unbanUserAction.execute(user, groupId, unbanUserDto);
  }

  @ApiOperation({ summary: 'Kick a user' })
  @HttpCode(HttpStatus.OK)
  @Post('kick-user')
  async kickUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() kickUserDto: KickUserDto,
  ) {
    return this.kickUserAction.execute(user, groupId, kickUserDto);
  }

  @ApiOperation({ summary: 'Join a group' })
  @HttpCode(HttpStatus.OK)
  @Post('join')
  async joinGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() joinGroupDto: JoinGroupDto,
  ) {
    return this.joinAction.execute(user, groupId, joinGroupDto);
  }

  @ApiOperation({ summary: 'Leave a group' })
  @HttpCode(HttpStatus.OK)
  @Post('leave')
  async leaveGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
  ) {
    return this.leaveAction.execute(user, groupId);
  }

  @ApiOperation({ summary: 'Leave a group' })
  @HttpCode(HttpStatus.OK)
  @Post('owner-leave')
  async ownerLeaveGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() leaveGroupDto: OwnerLeaveGroupDto,
  ) {
    return this.ownerLeaveAction.execute(user, groupId, leaveGroupDto);
  }

  @ApiOperation({ summary: 'Mute a user' })
  @HttpCode(HttpStatus.OK)
  @Post('mute')
  async muteUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.muteUserAction.execute(user, groupId, muteUserDto);
  }
}
