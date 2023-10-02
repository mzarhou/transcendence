import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from '../chat/chat.service';
import { Socket } from 'socket.io';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';
import { MESSAGE_EVENT } from '@transcendence/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { env } from '@src/+env/server';
import { WebsocketService } from '@src/websocket/websocket.service';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ZodWsExceptionFilter } from '@src/websocket/zod-ws-exception.filter';

@UsePipes(new ZodValidationPipe())
@UseFilters(new ZodWsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
})
export class MessageGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly websocketService: WebsocketService,
  ) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(MESSAGE_EVENT)
  async newMessage(
    @ConnectedSocket() senderClient: Socket,
    @MessageBody() { message, recipientId }: MessageDto,
  ) {
    const sender: ActiveUserData = senderClient.data.user;
    const isRecipientFriend = await this.chatService.isFriendOf(
      sender,
      recipientId,
    );
    if (!isRecipientFriend) {
      throw new WsException('Sending Messase: Invalid user');
    }

    try {
      const createdMessage = await this.messageService.saveMessage(sender, {
        message,
        recipientId,
      });

      /**
       * send message to sender/recipient if he is connected
       */
      this.websocketService.addEvent(
        [sender.sub, recipientId],
        MESSAGE_EVENT,
        createdMessage,
      );
    } catch (error) {
      throw new WsException('Sending Messase: Something went wrong!');
    }
  }
}
