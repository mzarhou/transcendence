import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { AddGroupAdminDto } from './dto/group-admin/add-group-admin.dto';
import { BanUserDto } from './dto/ban-user/ban-user.dto';
import { UnBanUserDto } from './dto/ban-user/unban-user.dto';
import { RemoveGroupAdminDto } from './dto/group-admin/remove-group-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KickUserDto } from './dto/kick-user.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { LeaveGroupDto } from './dto/leave-group.dto';
import { SearchUsersDto } from '@src/chat/dto/search-users.dto';
import { GroupUsersFilterDto } from './dto/group-users-filter-query.dto';

@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Create new group' })
  @Post()
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupsService.create(user, createGroupDto);
  }

  @ApiOperation({ summary: 'Update the group' })
  @Patch(':id')
  async update(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(user, groupId, updateGroupDto);
  }

  @ApiOperation({ summary: 'Delete the group' })
  @Delete(':id')
  async remove(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
  ) {
    return this.groupsService.remove(user, groupId);
  }

  @ApiOperation({ summary: 'Add an admin' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/add-admin')
  async addAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() addGroupAdminDto: AddGroupAdminDto,
  ) {
    return this.groupsService.addGroupAdmin(user, groupId, addGroupAdminDto);
  }

  @ApiOperation({ summary: 'Remove an admin (change its role to member)' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/remove-admin')
  async removeAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() removeGroupAdminDto: RemoveGroupAdminDto,
  ) {
    return this.groupsService.removeGroupAdmin(
      user,
      groupId,
      removeGroupAdminDto,
    );
  }

  @ApiOperation({ summary: 'Ban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/ban-user')
  async banUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.groupsService.banUser(user, groupId, banUserDto);
  }

  @ApiOperation({ summary: 'Unban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/unban-user')
  async unBanUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() unbanUserDto: UnBanUserDto,
  ) {
    return this.groupsService.unbanUser(user, groupId, unbanUserDto);
  }

  @ApiOperation({ summary: 'Kick a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/kick-user')
  async kickUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() kickUserDto: KickUserDto,
  ) {
    return this.groupsService.kickUser(user, groupId, kickUserDto);
  }

  @ApiOperation({ summary: 'Join a group' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/join')
  async joinGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() joinGroupDto: JoinGroupDto,
  ) {
    return this.groupsService.joinGroup(user, groupId, joinGroupDto);
  }

  @ApiOperation({ summary: 'Leave a group' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/leave')
  async leaveGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() leaveGroupDto: LeaveGroupDto,
  ) {
    return this.groupsService.leaveGroup(user, groupId, leaveGroupDto);
  }

  @ApiOperation({ summary: 'Search public/protected groups' })
  @Get('search')
  async search(
    @ActiveUser() user: ActiveUserData,
    @Query() { term }: SearchUsersDto,
  ) {
    return this.groupsService.search(user, term);
  }

  @ApiOperation({ summary: 'Get user groups' })
  @Get()
  async findGroups(@ActiveUser() user: ActiveUserData) {
    return this.groupsService.findUserGroups(user);
  }

  @ApiOperation({ summary: 'Get group' })
  @Get('/:id')
  async show(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
  ) {
    return this.groupsService.showGroup(user, groupId);
  }

  @ApiOperation({ summary: 'Get group' })
  @Get('/:id/users')
  async findUsers(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Query() query: GroupUsersFilterDto,
  ) {
    return this.groupsService.findGroupUsers(user, groupId, query);
  }
}
