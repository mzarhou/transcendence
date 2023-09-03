import { OnApplicationShutdown, UseFilters, UsePipes } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ZodWsExceptionFilter } from '@src/websocket/zod-ws-exception.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { Subscription } from 'rxjs';
import { GroupsService } from './groups.service';
import { WebsocketService } from '@src/websocket/websocket.service';
import {
  CONNECTION_STATUS,
  NewSocketData,
} from '@src/websocket/websocket.enum';
import { Server } from 'socket.io';
import { env } from '@src/+env/server';
import {
  GROUP_USER_DISCONNECTED_EVENT,
  GroupUserDisconnectedData,
} from '@transcendence/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GROUP_USER_CONNECTED_EVENT } from '@transcendence/common';
import { GroupUserConnectedData } from '@transcendence/common';
import { GroupChatService } from './group-chat/group-chat.service';

@UsePipes(new ZodValidationPipe())
@UseFilters(new ZodWsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
})
export class GroupsGateway implements OnGatewayInit, OnApplicationShutdown {
  private subscription!: Subscription;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly service: GroupsService,
    private readonly groupChatService: GroupChatService,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: Server) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event) => {
        if (event.name === CONNECTION_STATUS.NEW_SOCKET) {
          this.onNewSocketConnected(event.data as NewSocketData);
        } else if (event.name === CONNECTION_STATUS.CONNECTED) {
          this.onUserConnected(event.data as ActiveUserData);
        } else if (event.name === CONNECTION_STATUS.DISCONNECTED) {
          this.onUserDisconnect(event.data as ActiveUserData);
        }
      },
    });
  }

  async onNewSocketConnected({ user, socket }: NewSocketData) {
    const userGroups = await this.service.findUserGroups(user);
    for (const group of userGroups) {
      socket.join(this.groupChatService.getGroupRoomKey(group.id));
    }
  }

  async onUserConnected(user: ActiveUserData) {
    const userGroups = await this.service.findUserGroups(user);
    for (const group of userGroups) {
      this.websocketService.addEvent(
        [this.groupChatService.getGroupRoomKey(group.id)],
        GROUP_USER_CONNECTED_EVENT,
        {
          userId: user.sub,
          groupId: group.id,
        } satisfies GroupUserConnectedData,
      );
    }
  }

  async onUserDisconnect(user: ActiveUserData) {
    const userGroups = await this.service.findUserGroups(user);
    for (const group of userGroups) {
      this.websocketService.addEvent(
        [this.groupChatService.getGroupRoomKey(group.id)],
        GROUP_USER_DISCONNECTED_EVENT,
        {
          userId: user.sub,
          groupId: group.id,
        } satisfies GroupUserDisconnectedData,
      );
    }
  }
}
