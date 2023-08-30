import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from '@src/+prisma/prisma.module';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { IamModule } from '@src/iam/iam.module';
import { GroupsRepository } from './repositories/_goups.repository';
import { GroupsPrismaRepository } from './repositories/groups-prisma.repository';
import { GroupsPolicy } from './groups.policy';

@Module({
  imports: [PrismaModule, NotificationsModule, IamModule],
  controllers: [GroupsController],
  providers: [
    GroupsPolicy,
    GroupsService,
    {
      provide: GroupsRepository,
      useClass: GroupsPrismaRepository,
    },
  ],
})
export class GroupsModule {}
