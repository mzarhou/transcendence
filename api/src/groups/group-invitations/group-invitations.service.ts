import { Injectable } from '@nestjs/common';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsInvitationsRepository } from './repositories/_groups-invitations.repository';
import { GroupInvitationsPolicy } from './group-invitations.policy';
import { WebsocketService } from '@src/websocket/websocket.service';

@Injectable()
export class GroupInvitationsService {
  constructor(
    private readonly repository: GroupsInvitationsRepository,
    private readonly policy: GroupInvitationsPolicy,
    private readonly websocket: WebsocketService,
  ) {}

  async create(
    user: ActiveUserData,
    { groupId, userId }: CreateGroupInvitationDto,
  ) {
    const group = await this.repository.findGroupWithUsers(groupId);

    this.policy.canCreate(user, group);

    const invitationWithGroup = await this.repository.createInvitation({
      userId,
      groupId,
      invitedById: user.sub,
    });

    this.websocket.addEvent([userId], 'GroupInvitation', invitationWithGroup);

    return { success: true };
  }

  findAll(user: ActiveUserData, groupId: string) {
    return `This action returns all groupInvitations`;
  }

  remove(user: ActiveUserData, data: { groupId: string; id: string }) {
    return `This action removes a #${data.id} groupInvitation`;
  }
}
