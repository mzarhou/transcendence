import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { MessageType } from '@transcendence/common';

@WebSocketGateway({
  cors: {
    // Todo: use env FRONTEND_URL
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients: Map<number, Socket> = new Map();

  UNAUTHORIZED_EVENT = 'Unauthorized';

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: Socket) {
    this.logger.log(`new user connected with id ${socket.id}`);
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      socket.emit(this.UNAUTHORIZED_EVENT);
      return socket.disconnect();
    }

    this.connectedClients.set(user.sub, socket);
  }

  handleDisconnect(socket: Socket) {
    delete this.connectedClients[socket.id];
    this.logger.log(`user ${socket.id} disconnected`);
  }

  @SubscribeMessage('chat')
  async newMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { message, userId: targetClientId }: MessageDto,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      socket.emit(this.UNAUTHORIZED_EVENT);
      return socket.disconnect();
    }
    if (!this.chatService.isFriendOf(user, targetClientId)) {
      return socket.emit('chat_error', 'Invalid user');
    }

    const targetClient = this.connectedClients.get(targetClientId);
    const userClient = this.connectedClients.get(user.sub);
    if (!targetClient || !userClient) {
      return socket.emit('chat_error', 'Invalid user');
    }

    const data: MessageType = {
      message,
      userId: user.sub,
    };
    targetClient.emit('chat', data);
    userClient.emit('chat', data);
  }
}
