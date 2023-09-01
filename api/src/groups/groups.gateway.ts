import {
  OnApplicationShutdown,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { ZodWsExceptionFilter } from '@src/websocket/zod-ws-exception.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { Subscription } from 'rxjs';
import { GroupsService } from './groups.service';
import { WebsocketService } from '@src/websocket/websocket.service';
import {
  CONNECTION_STATUS,
  NewSocketData,
} from '@src/websocket/websocket.enum';
import { Server, Socket } from 'socket.io';
import { env } from '@src/+env/server';
import {
  GROUP_MESSAGE_EVENT,
  GROUP_USER_DISCONNECTED_EVENT,
  GroupUserDisconnectedData,
} from '@transcendence/common';
import { SendGroupMessageDto } from './dto/group-message';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsPolicy } from './groups.policy';
import { GroupsRepository } from './repositories/_goups.repository';
import { GROUP_USER_CONNECTED_EVENT } from '@transcendence/common';
import { GroupUserConnectedData } from '@transcendence/common';

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
    private readonly policy: GroupsPolicy,
    private readonly repository: GroupsRepository,
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
      socket.join(this.getGroupRoomKey(group.id));
    }
  }

  async onUserConnected(user: ActiveUserData) {
    const userGroups = await this.service.findUserGroups(user);
    for (const group of userGroups) {
      this.websocketService.addEvent(
        [this.getGroupRoomKey(group.id)],
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
        [this.getGroupRoomKey(group.id)],
        GROUP_USER_DISCONNECTED_EVENT,
        {
          userId: user.sub,
          groupId: group.id,
        } satisfies GroupUserDisconnectedData,
      );
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(GROUP_MESSAGE_EVENT)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { groupId, message }: SendGroupMessageDto,
  ) {
    const user = socket.data.user as ActiveUserData;
    try {
      const group = await this.service.findGroupById(groupId);
      await this.policy.canSendMessage(user, group);

      const createdMessage = await this.repository.createMessage({
        groupId: group.id,
        message,
        senderId: user.sub,
      });

      this.websocketService.addEvent(
        [this.getGroupRoomKey(group.id)],
        GROUP_MESSAGE_EVENT,
        createdMessage,
      );
    } catch (error) {
      throw new WsException('You cannot send message to this group');
    }
  }

  private getGroupRoomKey(groupId: number) {
    return `groups.${groupId}`;
  }
}
