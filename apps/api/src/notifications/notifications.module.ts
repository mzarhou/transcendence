import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { IamModule } from '@src/iam/iam.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './repositories/notifications.repository';
import { NotificationsPrismaRepository } from './repositories/notifications-prisma.repository';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsService,
    {
      provide: NotificationsRepository,
      useClass: NotificationsPrismaRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
