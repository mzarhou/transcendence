import { Module } from '@nestjs/common';
import { GroupInvitationsController } from './group-invitations.controller';
import { GroupInvitationsService } from './group-invitations.service';
import { GroupsInvitationsRepository } from './repositories/_groups-invitations.repository';
import { GroupsInvitationsPrismaRepository } from './repositories/groups-prisma-invitations.repository';
import { GroupInvitationsPolicy } from './group-invitations.policy';

@Module({
  controllers: [GroupInvitationsController],
  providers: [
    GroupInvitationsService,
    GroupInvitationsPolicy,
    {
      provide: GroupsInvitationsRepository,
      useClass: GroupsInvitationsPrismaRepository,
    },
  ],
})
export class GroupInvitationsModule {}
