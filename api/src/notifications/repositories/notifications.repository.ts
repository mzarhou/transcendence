import { Injectable } from '@nestjs/common';
import { Notification } from '@transcendence/common';

@Injectable()
export abstract class NotificationsRepository {
  abstract create(
    recipientId: number,
    event: string,
    data: any,
  ): Promise<Notification>;

  abstract findUserNotifications(userId: number): Promise<Notification[]>;
  abstract deleteAll(userId: number): Promise<void>;
  abstract readAll(userId: number): Promise<void>;
}
