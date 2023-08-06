import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FriendRequestsRepository } from './repositories/_friend-requests.repository';
import { FriendRequestsPrismaRepository } from './repositories/friend-requests-prisma.repository';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [FriendRequestController],
  providers: [
    FriendRequestService,
    {
      provide: FriendRequestsRepository,
      useClass: FriendRequestsPrismaRepository,
    },
  ],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
