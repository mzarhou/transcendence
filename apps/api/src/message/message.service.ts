import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ChatService } from '@src/chat/chat.service';
import { MESSAGE_READ_EVENT } from '@transcendence/db';
import { MessagesRepository } from './repositories/messages.repository';
import { MessagesPolicy } from './message.policy';
import { WebsocketService } from '@src/websocket/websocket.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatService: ChatService,
    private readonly messagesPolicy: MessagesPolicy,
    private readonly websocketService: WebsocketService,
  ) {}

  async saveMessage(
    sender: ActiveUserData,
    { message, recipientId }: MessageDto,
  ) {
    return this.messagesRepository.create({
      senderId: sender.sub,
      recipientId,
      message,
    });
  }

  async readMessage(user: ActiveUserData, messageId: number) {
    const message = await this.messagesRepository.findOneOrThrow(messageId);
    this.messagesPolicy.canMarkMessageAsRead(user, message);
    const updatedMessage = await this.messagesRepository.update(messageId, {
      isRead: true,
    });
    this.websocketService.addEvent(
      [updatedMessage.senderId],
      MESSAGE_READ_EVENT,
      updatedMessage,
    );
  }

  findFriendMessages(user: ActiveUserData, friendId: number) {
    return this.messagesRepository.findAllFriendMessages({
      userId: user.sub,
      friendId,
    });
  }

  /**
   * Get unread messages from friends
   * @param user current authenticated user
   */
  async findUnreadMessages(user: ActiveUserData) {
    const friends = await this.chatService.findFriends(user);
    const friendsIds = friends.map((frd) => frd.id);
    return this.messagesRepository.findAllFiendsUnreadMessages(
      user.sub,
      friendsIds,
    );
  }
}
