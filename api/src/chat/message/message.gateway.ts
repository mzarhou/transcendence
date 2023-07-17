import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../chat.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { MessageService } from './message.service';
import {
  MESSAGE_EVENT,
  UNAUTHORIZED_EVENT,
  MESSAGE_ERROR_EVENT,
} from '@transcendence/common';

@WebSocketGateway({
  cors: {
    // Todo: use env FRONTEND_URL
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessageGateway.name);
  private connectedClients: Map<number, Socket> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: Socket) {
    this.logger.log(`new user connected with id ${socket.id}`);
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      socket.emit(UNAUTHORIZED_EVENT);
      return socket.disconnect();
    }

    this.connectedClients.set(user.sub, socket);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      return this.logger.warn(
        `failed to disconnect user ${socket.id} disconnected`,
      );
    }
    this.connectedClients.delete(user.sub);
    this.logger.log(`user ${socket.id} disconnected`);
  }

  @SubscribeMessage(MESSAGE_EVENT)
  async newMessage(
    @ConnectedSocket() senderClient: Socket,
    @MessageBody() { message, recipientId }: MessageDto,
  ) {
    if (message.length === 0) return;

    const sender = await this.chatService.getUserFromSocket(senderClient);
    if (!sender) {
      senderClient.emit(UNAUTHORIZED_EVENT);
      return senderClient.disconnect();
    }
    if (!this.connectedClients.has(sender.sub)) {
      this.connectedClients.set(sender.sub, senderClient);
    }

    if (!this.chatService.isFriendOf(sender, recipientId)) {
      return senderClient.emit(MESSAGE_ERROR_EVENT, 'Invalid friend');
    }

    const recipientClient = this.connectedClients.get(recipientId);

    try {
      const createdMessage = await this.messageService.saveMessage(sender, {
        message,
        recipientId,
      });

      /**
       * send message to recipient if he is connected
       */
      recipientClient?.emit(MESSAGE_EVENT, createdMessage);
      senderClient.emit(MESSAGE_EVENT, createdMessage);
    } catch (error) {
      return senderClient.emit(MESSAGE_ERROR_EVENT, 'Failed to save message');
    }
  }
}
