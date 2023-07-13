import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriends(activeUser: ActiveUserData) {
    const currentUser = await this.prisma.user.findFirstOrThrow({
      where: { id: activeUser.sub },
      include: {
        friends: true,
      },
    });
    return currentUser.friends;
  }

  async search(user: ActiveUserData, searchTerm: string) {
    if (searchTerm.length === 0) {
      return [];
    }

    const friends = await this.findFriends(user);

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: [user.sub],
        },
        name: {
          contains: searchTerm,
        },
      },
    });

    return users.map((u) => {
      const isFriend = friends.findIndex((frd) => frd.id === u.id) > -1;
      return { ...u, isFriend };
    });
  }
}
