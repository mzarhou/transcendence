import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { FriendRequestsRepository } from './repositories/_friend-requests.repository';
import { FriendRequestsPrismaRepository } from './repositories/friend-requests-prisma.repository';
import { FriendRequestPolicy } from './friend-request.policy';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [NotificationsModule, UsersModule],
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
