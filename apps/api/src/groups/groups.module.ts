import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { IamModule } from '@src/iam/iam.module';
import { GroupsGateway } from './groups.gateway';
import { GroupChatService } from './group-chat/group-chat.service';
import { GroupChatController } from './group-chat/group-chat.controller';
import { GroupInvitationsModule } from './group-invitations/group-invitations.module';
import { GroupManagementModule } from './group-management/group-management.module';
import { GroupsCommonModule } from './groups-common/groups-common.module';

@Module({
  imports: [
    IamModule,
    NotificationsModule,
    GroupInvitationsModule,
    GroupManagementModule,
    GroupsCommonModule,
  ],
  controllers: [GroupsController, GroupChatController],
  providers: [GroupsService, GroupsGateway, GroupChatService],
})
export class GroupsModule {}
