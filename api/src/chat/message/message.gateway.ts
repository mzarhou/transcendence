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

  handleDisconnect(socket: Socket) {
    delete this.connectedClients[socket.id];
    this.logger.log(`user ${socket.id} disconnected`);
  }

  @SubscribeMessage(MESSAGE_EVENT)
  async newMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { message, recipientId }: MessageDto,
  ) {
    if (message.length === 0) return;

    const sender = await this.chatService.getUserFromSocket(socket);
    if (!sender) {
      socket.emit(UNAUTHORIZED_EVENT);
      return socket.disconnect();
    }
    if (!this.chatService.isFriendOf(sender, recipientId)) {
      return socket.emit(MESSAGE_ERROR_EVENT, 'Invalid friend');
    }

    const recipientClient = this.connectedClients.get(recipientId);
    const senderClient = this.connectedClients.get(sender.sub);
    if (!recipientClient || !senderClient) {
      return socket.emit(MESSAGE_ERROR_EVENT, 'Invalid user');
    }

    try {
      const createdMessage = await this.messageService.saveMessage(sender, {
        message,
        recipientId,
      });
      recipientClient.emit(MESSAGE_EVENT, createdMessage);
      senderClient.emit(MESSAGE_EVENT, createdMessage);
    } catch (error) {
      return socket.emit(MESSAGE_ERROR_EVENT, 'Failed to save message');
    }
  }
}
