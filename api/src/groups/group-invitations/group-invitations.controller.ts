import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { CreateGroupInvitationAction } from './actions/_create-group-invitation.action';
import { RemoveGroupInvitationAction } from './actions/_remove-group-invitation.action';
import { GetGroupInvitationAction } from './actions/_get-group-invitations.action';
import { SearchInvitableUsersAction } from './actions/_search-invitable-users.action';

@ApiTags('groups')
@Controller('groups')
export class GroupInvitationsController {
  constructor(
    private readonly createInvitationAction: CreateGroupInvitationAction,
    private readonly removeInvitationAction: RemoveGroupInvitationAction,
    private readonly getInvitationsAction: GetGroupInvitationAction,
    private readonly searchInvitableUsersAction: SearchInvitableUsersAction,
  ) {}

  @ApiOperation({ summary: 'Invite user to group' })
  @Post('/:id/invitations')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() data: CreateGroupInvitationDto,
    @Param() { id: groupId }: IdDto,
  ) {
    return this.createInvitationAction.execute(user, groupId, data);
  }

  @ApiOperation({ summary: 'find group invitations of current user' })
  @Get('/invitations/all')
  findUserInvitations(@ActiveUser() user: ActiveUserData) {
    return this.getInvitationsAction.execute(user);
  }

  @ApiOperation({ summary: 'search invitable users' })
  @Get('/:id/search-invitable-users')
  searchInvitableUsers(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Query('term') searchTerm: string,
  ) {
    return this.searchInvitableUsersAction.execute(user, groupId, searchTerm);
  }

  @Delete('/:id/invitations')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: invitationId }: IdDto,
  ) {
    return this.removeInvitationAction.execute(user, invitationId);
  }
}
