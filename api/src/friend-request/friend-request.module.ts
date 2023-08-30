import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FriendRequestsRepository } from './repositories/_friend-requests.repository';
import { FriendRequestsPrismaRepository } from './repositories/friend-requests-prisma.repository';
import { FriendRequestPolicy } from './friend-request.policy';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [FriendRequestController],
  providers: [
    FriendRequestPolicy,
    FriendRequestService,
    {
      provide: FriendRequestsRepository,
      useClass: FriendRequestsPrismaRepository,
    },
  ],
  exports: [FriendRequestService, FriendRequestsRepository],
})
export class FriendRequestModule {}
