import { Injectable } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from '../chat.service';
import { ClientsStorage } from './clients.storage';
import { FRIEND_CONNECTED, FriendConnectedData } from '@transcendence/common';
import { FRIEND_DISCONNECTED } from '@transcendence/common';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
    private readonly clientsStorage: ClientsStorage,
  ) {}

  async saveMessage(
    sender: ActiveUserData,
    { message, recipientId }: MessageDto,
  ) {
    return this.prisma.message.create({
      data: { senderId: sender.sub, recipientId, message },
    });
  }

  findFriendMessages(user: ActiveUserData, friendId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: friendId,
            recipientId: user.sub,
          },
          {
            senderId: user.sub,
            recipientId: friendId,
          },
        ],
      },
    });
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
}
