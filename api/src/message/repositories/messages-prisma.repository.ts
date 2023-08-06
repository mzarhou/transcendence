import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesRepository } from './messages.repository';
import { MessageType } from '@transcendence/common';
import { MessageDto } from '../dto/message.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MessagesPrismaRepository extends MessagesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(args: MessageDto & { senderId: number }): Promise<MessageType> {
    return this.prisma.message.create({
      data: {
        senderId: args.senderId,
        recipientId: args.recipientId,
        message: args.message,
      },
    });
  }

  async update(
    messageId: number,
    data: { isRead: boolean },
  ): Promise<MessageType> {
    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: data.isRead,
      },
    });
    return updatedMessage;
  }

  async findOneOrThrow(messageId: number): Promise<MessageType> {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
    });
    if (!message) {
      throw new NotFoundException('message not found');
    }
    return message;
  }

  findAllFriendMessages(args: {
    userId: number;
    friendId: number;
  }): Promise<MessageType[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: args.friendId,
            recipientId: args.userId,
          },
          {
            senderId: args.userId,
            recipientId: args.friendId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  findAllFiendsUnreadMessages(
    userId: number,
    friendsIds: number[],
  ): Promise<MessageType[]> {
    return this.prisma.message.findMany({
      where: {
        recipientId: userId,
        isRead: false,
        senderId: {
          in: friendsIds,
        },
      },
    });
  }
}
