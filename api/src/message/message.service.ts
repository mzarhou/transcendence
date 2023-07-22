import { Injectable } from '@nestjs/common';
import { MessageDto } from '../chat/dto/message.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  async saveMessage(
    sender: ActiveUserData,
    { message, recipientId }: MessageDto,
  ) {
    return this.prisma.message.create({
      data: { senderId: sender.sub, recipientId, message },
    });
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
