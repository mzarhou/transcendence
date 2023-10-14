import { Module } from '@nestjs/common';
import { GroupsRepository } from './repositories/_groups.repository';
import { GroupsPrismaRepository } from './repositories/groups-prisma.repository';
import { GroupsPolicy } from './groups.policy';
import { GroupsMutedUsersStorage } from './groups-muted-users.storage';
import { RedisModule } from '@src/redis/redis.module';
import { UsersModule } from '@src/users/users.module';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [RedisModule],
  providers: [
    GroupsPolicy,
    GroupsMutedUsersStorage,
    {
      provide: GroupsRepository,
      useClass: GroupsPrismaRepository,
    },
  ],
  exports: [GroupsRepository, GroupsPolicy, GroupsMutedUsersStorage],
})
export class GroupsCommonModule {}
