import { Module } from '@nestjs/common';
import { GroupInvitationsController } from './group-invitations.controller';
import { GroupsInvitationsRepository } from './repositories/_groups-invitations.repository';
import { GroupsInvitationsPrismaRepository } from './repositories/groups-prisma-invitations.repository';
import { GroupInvitationsPolicy } from './group-invitations.policy';
import actions from './actions';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { UsersModule } from '@src/users/users.module';
import { GroupsCommonModule } from '../groups-common/groups-common.module';

@Module({
  imports: [UsersModule, NotificationsModule, GroupsCommonModule],
  controllers: [GroupInvitationsController],
  providers: [
    ...actions,
    GroupInvitationsPolicy,
    {
      provide: GroupsInvitationsRepository,
      useClass: GroupsInvitationsPrismaRepository,
    },
  ],
})
export class GroupInvitationsModule {}
