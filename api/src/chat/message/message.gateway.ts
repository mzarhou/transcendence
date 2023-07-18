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
import { HttpStatus, Logger, UseFilters, UsePipes } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { MessageService } from './message.service';
import { ERROR_EVENT, MESSAGE_EVENT } from '@transcendence/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { WebsocketExceptionFilter } from '../ws-exception.filter';
import { ClientsStorage } from './clients.storage';
import { WebsocketException } from '../ws.exception';

@UsePipes(new ZodValidationPipe())
@UseFilters(new WebsocketExceptionFilter())
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

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly clientsStorage: ClientsStorage,
  ) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.chatService.getUserFromSocket(socket);
      this.logger.log(`new user connected with id ${socket.id}`);
      this.clientsStorage.addClient(user.sub, socket);
    } catch (error) {
      this.logger.warn(`failed to connect user ${socket.id}`);
      if (error instanceof WebsocketException) {
        socket.emit(ERROR_EVENT, error.getError());
      }
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.chatService.getUserFromSocket(socket);
      this.clientsStorage.removeClient(user.sub, socket);
      this.logger.log(`user ${socket.id} disconnected`);
    } catch (error) {}
  }

  @SubscribeMessage(MESSAGE_EVENT)
  async newMessage(
    @ConnectedSocket() senderClient: Socket,
    @MessageBody() { message, recipientId }: MessageDto,
  ) {
    const sender = await this.chatService.getUserFromSocket(senderClient);
    if (!sender) {
      throw new WebsocketException({
        message: 'Sending Messase: Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (!this.clientsStorage.has(sender.sub, senderClient)) {
      this.clientsStorage.addClient(sender.sub, senderClient);
    }

    const isRecipientFriend = await this.chatService.isFriendOf(
      sender,
      recipientId,
    );
    if (!isRecipientFriend) {
      throw new WebsocketException('Sending Messase: Invalid user');
    }

    try {
      const createdMessage = await this.messageService.saveMessage(sender, {
        message,
        recipientId,
      });

      /**
       * send message to sender/recipient if he is connected
       */
      this.clientsStorage.emit(
        [sender.sub, recipientId],
        MESSAGE_EVENT,
        createdMessage,
      );
    } catch (error) {
      throw new WebsocketException('Sending Messase: Something went wrong!');
    }
  }
}
