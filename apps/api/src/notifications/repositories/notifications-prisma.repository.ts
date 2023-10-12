import { Injectable } from '@nestjs/common';
import { Notification } from '@transcendence/db';
import { PrismaService } from '@src/+prisma/prisma.service';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsPrismaRepository extends NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(recipientId: number, event: string, data: any): Promise<Notification> {
    return this.prisma.notifications.create({
      data: {
        event,
        data: JSON.stringify(data),
        recipientId,
      },
    });
  }

  async findUserNotifications(userId: number): Promise<Notification[]> {
    const data = await this.prisma.notifications.findMany({
      where: { recipientId: userId },
      orderBy: [{ createdAt: 'desc' }],
    });
    return data.map((notification) => ({
      ...notification,
      data: JSON.parse(notification.data),
    }));
  }

  async deleteAll(userId: number): Promise<void> {
    await this.prisma.notifications.deleteMany({
      where: { recipientId: userId },
    });
  }

  async readAll(userId: number): Promise<void> {
    await this.prisma.notifications.updateMany({
      where: { isRead: false, recipientId: userId },
      data: {
        isRead: true,
      },
    });
  }
}
