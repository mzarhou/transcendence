import { Injectable } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

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
}
