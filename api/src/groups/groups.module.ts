import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { IamModule } from '@src/iam/iam.module';
import { GroupsRepository } from './repositories/_goups.repository';
import { GroupsPrismaRepository } from './repositories/groups-prisma.repository';
import { GroupsPolicy } from './groups.policy';
import { GroupsGateway } from './groups.gateway';
import { GroupsMutedUsersStorage } from './groups-muted-users.storage';
import { RedisModule } from '@src/redis/redis.module';

@Module({
  imports: [NotificationsModule, IamModule, RedisModule],
  controllers: [GroupsController],
  providers: [
    GroupsPolicy,
    GroupsService,
    {
      provide: GroupsRepository,
      useClass: GroupsPrismaRepository,
    },
    GroupsGateway,
    GroupsMutedUsersStorage,
  ],
})
export class GroupsModule {}
