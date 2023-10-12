import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupInvitationsPolicy } from '../group-invitations.policy';
import { GroupsInvitationsRepository } from '../repositories/_groups-invitations.repository';

@Injectable()
export class GetGroupInvitationAction {
  constructor(
    private readonly repository: GroupsInvitationsRepository,
    private readonly policy: GroupInvitationsPolicy,
  ) {}

  async execute(user: ActiveUserData) {
    const invitations = await this.repository.findUserInvitations(user.sub);

    if (invitations.length) {
      this.policy.canView(user, invitations[0]);
    }

    return invitations.map((it) => ({
      ...it,
      group: { ...it.group, users: undefined },
    }));
  }
}
