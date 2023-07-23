import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationsClientsStorage } from './notifications-clients.storage';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import {
  FRIEND_CONNECTED,
  FRIEND_DISCONNECTED,
  FriendConnectedData,
} from '@transcendence/common';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly clientsStorage: NotificationsClientsStorage,
    private readonly clientStorage: NotificationsClientsStorage,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  async notify(usersIds: number[], event: string, data: any) {
    await Promise.all(
      usersIds.map((recipientId) =>
        this.prisma.notifications.create({
          data: {
            event,
            data: JSON.stringify(data),
            recipientId,
          },
        }),
      ),
    );
    this.clientStorage.emit(usersIds, event, data);
  }

  emit(usersIds: number[], event: string, ...data: any[]) {
    this.clientStorage.emit(usersIds, event, ...data);
  }

  async sendFriendConnectedEvent(user: ActiveUserData) {
    this.onConnectionStatusChanged(user, 'connected');
  }

  async sendFriendDisconnectedEvent(user: ActiveUserData) {
    const connectedSocketsCount = this.clientsStorage.connectedSoketsCount(
      user.sub,
    );
    if (connectedSocketsCount !== 0) return;
    this.onConnectionStatusChanged(user, 'disconnected');
  }

  private async onConnectionStatusChanged(
    user: ActiveUserData,
    event: 'connected' | 'disconnected',
  ) {
    const friends = await this.chatService.findFriends(user);
    const friendsIds = friends.map((friend) => friend.id);

    /** let user know all connected friends */
    if (event === 'connected') {
      for (const friendId of friendsIds) {
        if (!this.clientsStorage.isConnected(friendId)) continue;

        this.clientsStorage.emit([user.sub], FRIEND_CONNECTED, {
          friendId,
        } satisfies FriendConnectedData);

        this.clientsStorage.emit([friendId], FRIEND_CONNECTED, {
          friendId: user.sub,
        } satisfies FriendConnectedData);
      }
    } else {
      this.clientsStorage.emit(friendsIds, FRIEND_DISCONNECTED, {
        friendId: user.sub,
      } satisfies FriendConnectedData);
    }
  }

  async findNotifications(user: ActiveUserData) {
    const data = await this.prisma.notifications.findMany({
      where: { recipientId: user.sub },
      orderBy: [{ createdAt: 'desc' }],
    });
    return data.map((notification) => ({
      ...notification,
      data: JSON.parse(notification.data),
    }));
  }

  async clearAll(user: ActiveUserData) {
    await this.prisma.notifications.deleteMany({
      where: { recipientId: user.sub },
    });
  }

  async readAll(user: ActiveUserData) {
    await this.prisma.notifications.updateMany({
      where: { isRead: false, recipientId: user.sub },
      data: {
        isRead: true,
      },
    });
  }
}
