import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MESSAGE_READ_EVENT } from '@transcendence/common';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async saveMessage(
    sender: ActiveUserData,
    { message, recipientId }: MessageDto,
  ) {
    return this.prisma.message.create({
      data: { senderId: sender.sub, recipientId, message },
    });
  }

  async readMessage(messageId: number) {
    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
      },
    });
    this.notificationsService.emit(
      [updatedMessage.senderId],
      MESSAGE_READ_EVENT,
      updatedMessage,
    );
  }

  async findOne(id: number) {
    const message = await this.prisma.message.findFirst({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('message not found');
    }
    return message;
  }

  findFriendMessages(user: ActiveUserData, friendId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: friendId,
            recipientId: user.sub,
          },
          {
            senderId: user.sub,
            recipientId: friendId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Get unread messages from friends
   * @param user current authenticated user
   */
  async findUnreadMessages(user: ActiveUserData) {
    const friends = await this.chatService.findFriends(user);
    const friendsIds = friends.map((frd) => frd.id);
    return this.prisma.message.findMany({
      where: {
        recipientId: user.sub,
        isRead: false,
        senderId: {
          in: friendsIds,
        },
      },
    });
  }
}
