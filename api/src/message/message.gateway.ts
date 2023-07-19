import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { Socket } from 'socket.io';
import { HttpStatus, UseFilters, UsePipes } from '@nestjs/common';
import { MessageDto } from '../chat/dto/message.dto';
import { MessageService } from './message.service';
import { MESSAGE_EVENT } from '@transcendence/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { WebsocketExceptionFilter } from '../notifications/ws-exception.filter';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { WebsocketException } from 'src/notifications/ws.exception';
import { NotificationsService } from 'src/notifications/notifications.service';

@UsePipes(new ZodValidationPipe())
@UseFilters(new WebsocketExceptionFilter())
@WebSocketGateway({
  cors: {
    // Todo: use env FRONTEND_URL
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MessageGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthenticationService,
    private readonly messageService: MessageService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @SubscribeMessage(MESSAGE_EVENT)
  async newMessage(
    @ConnectedSocket() senderClient: Socket,
    @MessageBody() { message, recipientId }: MessageDto,
  ) {
    const sender = await this.authService.getUserFromSocket(senderClient);
    if (!sender) {
      throw new WebsocketException({
        message: 'Sending Messase: Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
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
      this.notificationsService.notify(
        [sender.sub, recipientId],
        MESSAGE_EVENT,
        createdMessage,
      );
    } catch (error) {
      throw new WebsocketException('Sending Messase: Something went wrong!');
    }
  }
}
