import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GroupInvitationsService } from './group-invitations.service';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';

@Controller(':groupId/invitations')
export class GroupInvitationsController {
  constructor(
    private readonly groupInvitationsService: GroupInvitationsService,
  ) {}

  @Post()
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createGroupInvitationDto: CreateGroupInvitationDto,
  ) {
    return this.groupInvitationsService.create(user, createGroupInvitationDto);
  }

  @Get()
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Param('groupId') groupId: string,
  ) {
    return this.groupInvitationsService.findAll(user, groupId);
  }

  @Delete(':id')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param() { groupId, id }: { groupId: string; id: string },
  ) {
    return this.groupInvitationsService.remove(user, { id, groupId });
  }
}
