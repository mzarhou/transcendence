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
  GROUP_BANNED_NOTIFICATION,
  GROUP_DELETED_NOTIFICATION,
  GROUP_KICKED_NOTIFICATION,
  GROUP_NOTIFICATION_PAYLOAD,
  GROUP_USER_DISCONNECTED_EVENT,
  GroupUserDisconnectedData,
  JOIN_GROUP_NOTIFICATION,
  LEAVE_GROUP_NOTIFICATION,
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
        } else if (event.name === GROUP_DELETED_NOTIFICATION) {
          const { groupId } = event.data as GROUP_NOTIFICATION_PAYLOAD;
          this.websocketService.deleteRoom(
            this.groupChatService.getGroupRoomKey(groupId),
          );
        } else if (
          [
            GROUP_BANNED_NOTIFICATION,
            LEAVE_GROUP_NOTIFICATION,
            GROUP_KICKED_NOTIFICATION,
          ].includes(event.name)
        ) {
          const userId = parseInt(event.rooms[0].toString());
          const data = event.data as GROUP_NOTIFICATION_PAYLOAD;
          this.websocketService.leaveRoom(
            userId,
            this.groupChatService.getGroupRoomKey(data.groupId),
          );
          this.websocketService.addEvent(
            [this.groupChatService.getGroupRoomKey(data.groupId)],
            GROUP_USER_CONNECTED_EVENT,
            {
              userId,
              groupId: data.groupId,
            } satisfies GroupUserConnectedData,
          );
        } else if (event.name === JOIN_GROUP_NOTIFICATION) {
          const userId = parseInt(event.rooms[0].toString());
          const { groupId } = event.data as GROUP_NOTIFICATION_PAYLOAD;
          this.websocketService.joinRoom(
            userId,
            this.groupChatService.getGroupRoomKey(groupId),
          );
          this.websocketService.addEvent(
            [this.groupChatService.getGroupRoomKey(groupId)],
            GROUP_USER_CONNECTED_EVENT,
            { groupId, userId } satisfies GroupUserDisconnectedData,
          );
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
