import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { IamModule } from '@src/iam/iam.module';
import { GroupsRepository } from './repositories/_groups.repository';
import { GroupsPrismaRepository } from './repositories/groups-prisma.repository';
import { GroupsPolicy } from './groups.policy';
import { GroupsGateway } from './groups.gateway';
import { GroupsMutedUsersStorage } from './groups-muted-users.storage';
import { RedisModule } from '@src/redis/redis.module';
import { GroupChatService } from './group-chat/group-chat.service';
import { GroupChatController } from './group-chat/group-chat.controller';
import { UsersModule } from '@src/users/users.module';
import { GroupInvitationsModule } from './group-invitations/group-invitations.module';

@Module({
  imports: [
    NotificationsModule,
    IamModule,
    RedisModule,
    UsersModule,
    GroupInvitationsModule,
  ],
  controllers: [GroupsController, GroupChatController],
  providers: [
    GroupsPolicy,
    GroupsService,
    {
      provide: GroupsRepository,
      useClass: GroupsPrismaRepository,
    },
    GroupsGateway,
    GroupsMutedUsersStorage,
    GroupChatService,
  ],
})
export class GroupsModule {}
