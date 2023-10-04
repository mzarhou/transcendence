import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { NotificationsRepository } from './repositories/notifications.repository';
import { WebsocketService } from '@src/websocket/websocket.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async notify(usersIds: number[], event: string, data: any) {
    await Promise.all(
      usersIds.map((recipientId) =>
        this.notificationsRepository.create(recipientId, event, data),
      ),
    );
    this.websocketService.addEvent(usersIds, event, data);
  }

  async findNotifications(user: ActiveUserData) {
    return this.notificationsRepository.findUserNotifications(user.sub);
  }

  async clearAll(user: ActiveUserData) {
    await this.notificationsRepository.deleteAll(user.sub);
  }

  async readAll(user: ActiveUserData) {
    await this.notificationsRepository.readAll(user.sub);
  }
}
