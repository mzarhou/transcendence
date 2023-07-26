import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [PrismaModule, NotificationsModule, IamModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
