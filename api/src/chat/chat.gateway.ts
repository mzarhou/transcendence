import { WebSocketGateway } from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets';
import { OnApplicationShutdown } from '@nestjs/common';
import { WebsocketService } from '@src/websocket/websocket.service';
import { Subscription } from 'rxjs';
import { Server } from 'socket.io';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ChatService } from '@src/chat/chat.service';
import { FRIEND_CONNECTED } from '@transcendence/common';
import { FRIEND_DISCONNECTED } from '@transcendence/common';
import { FriendConnectedData } from '@transcendence/common';
import { env } from '@src/+env/server';

@WebSocketGateway({
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnApplicationShutdown {
  private subscription!: Subscription;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly service: ChatService,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: Server) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event) => {
        if (
          event.name === CONNECTION_STATUS.CONNECTED ||
          event.name === CONNECTION_STATUS.DISCONNECTED
        ) {
          this.onConnectionStatusChanged(
            event.name,
            event.data as ActiveUserData,
          );
        }
      },
    });
  }

  private async onConnectionStatusChanged(
    event: CONNECTION_STATUS,
    user: ActiveUserData,
  ) {
    const _friends = (await this.service.findFriends(user)).map((f) => f.id);
    const connectedFriends =
      this.websocketService.filterConnectedUsers(_friends);

    /** let user know all connected friends */
    if (event === 'connected') {
      for (const friendId of connectedFriends) {
        this.websocketService.addEvent([user.sub], FRIEND_CONNECTED, {
          friendId,
        } satisfies FriendConnectedData);
      }
      this.websocketService.addEvent(connectedFriends, FRIEND_CONNECTED, {
        friendId: user.sub,
      } satisfies FriendConnectedData);
    } else {
      this.websocketService.addEvent(connectedFriends, FRIEND_DISCONNECTED, {
        friendId: user.sub,
      } satisfies FriendConnectedData);
    }
  }
}
