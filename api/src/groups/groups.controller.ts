import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { IdDto } from 'src/common/dto/id-param.dto';
import { subject } from '@casl/ability';
import { AddGroupAdminDto } from './dto/group-admin/add-group-admin.dto';
import { BanUserDto } from './dto/ban-user/ban-user.dto';
import { UnBanUserDto } from './dto/ban-user/unban-user.dto';
import { RemoveGroupAdminDto } from './dto/group-admin/remove-group-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KickUserDto } from './dto/kick-user.dto';

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
    @Param() { id }: IdDto,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.groupsService.findOne(id);
    user.allow('update', subject('Group', group));
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({ summary: 'Delete the group' })
  @Delete(':id')
  async remove(@ActiveUser() user: ActiveUserData, @Param() { id }: IdDto) {
    const group = await this.groupsService.findOne(id);
    user.allow('delete', subject('Group', group));
    return this.groupsService.remove(id);
  }

  @ApiOperation({ summary: 'Add an admin' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/add-admin')
  async addAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() addGroupAdminDto: AddGroupAdminDto,
  ) {
    const group = await this.groupsService.findOne(groupId, {
      includeBlockedUsers: true,
    });
    /**
     * if a user can delete a group
     * its a group owner
     */
    user.allow('add-admin', subject('Group', group));
    return this.groupsService.addGroupAdmin(group, addGroupAdminDto);
  }

  @ApiOperation({ summary: 'Remove an admin (change its role to member)' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/remove-admin')
  async removeAdmin(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() removeGroupAdminDto: RemoveGroupAdminDto,
  ) {
    const group = await this.groupsService.findOne(groupId);
    /**
     * if a user can delete a group
     * its a group owner
     */
    user.allow('update', subject('Group', group), 'users.role');
    return this.groupsService.removeGroupAdmin(group, removeGroupAdminDto);
  }

  @ApiOperation({ summary: 'Ban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/ban-user')
  async banUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() banUserDto: BanUserDto,
  ) {
    const group = await this.groupsService.findOne(groupId, {
      includeUsers: true,
    });

    if (this.groupsService.isUserAdmin(banUserDto.userId, group)) {
      user.allow('delete', subject('Group', group));
    } else {
      user.allow('ban-user', subject('Group', group));
    }
    return this.groupsService.banUser(group, banUserDto);
  }

  @ApiOperation({ summary: 'Unban a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/unban-user')
  async unBanUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() unbanUserDto: UnBanUserDto,
  ) {
    const group = await this.groupsService.findOne(groupId, {
      includeBlockedUsers: true,
    });
    if (this.groupsService.isUserAdmin(unbanUserDto.userId, group)) {
      user.allow('delete', subject('Group', group));
    } else {
      user.allow('unban-user', subject('Group', group));
    }
    return this.groupsService.unbanUser(group, unbanUserDto);
  }

  @ApiOperation({ summary: 'Kick a user' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/kick-user')
  async kickUser(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Body() kickUserDto: KickUserDto,
  ) {
    const group = await this.groupsService.findOne(groupId, {
      includeUsers: true,
    });
    const isTargetUserAdmin = this.groupsService.isUserAdmin(
      kickUserDto.userId,
      group,
    );
    if (isTargetUserAdmin) {
      user.allow('delete', subject('Group', group), 'users.role');
    } else {
      user.allow('kick-user', subject('Group', group));
    }
    return this.groupsService.kickUser(group.id, kickUserDto);
  }

  @ApiOperation({ summary: 'Join a group' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/join')
  async joinGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
  ) {
    const group = await this.groupsService.findOne(groupId, {
      includeBlockedUsers: true,
    });
    user.allow('join', subject('Group', group));
    return this.groupsService.joinGroup(user, group);
  }

  @ApiOperation({ summary: 'Join a group' })
  @HttpCode(HttpStatus.OK)
  @Post('/:id/join')
  async leaveGroup(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
  ) {
    const group = await this.groupsService.findOne(groupId);
    user.allow('leave', subject('Group', group));
    return this.groupsService.leaveGroup(user, group);
  }
}
