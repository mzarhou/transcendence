import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsClientsStorage } from './notifications-clients.storage';
import { NotificationsGateway } from './notifications.gateway';
import { IamModule } from '@src/iam/iam.module';
import { ChatModule } from '@src/chat/chat.module';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '@src/+prisma/prisma.module';
import { NotificationsRepository } from './repositories/notifications.repository';
import { NotificationsPrismaRepository } from './repositories/notifications-prisma.repository';

@Module({
  imports: [PrismaModule, IamModule, forwardRef(() => ChatModule)],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsClientsStorage,
    NotificationsGateway,
    NotificationsService,
    {
      provide: NotificationsRepository,
      useClass: NotificationsPrismaRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
