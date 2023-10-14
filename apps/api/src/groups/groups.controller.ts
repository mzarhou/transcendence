import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Get group users' })
  @Get('/:id/users')
  async findUsers(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Query() query: GroupUsersFilterDto,
  ) {
    return this.groupsService.findGroupUsers(user, groupId, query);
  }
}
