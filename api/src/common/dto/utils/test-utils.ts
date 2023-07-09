import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

export const createUser = async (prisma: PrismaService, name: string) => {
  return prisma.user.create({
    data: {
      avatar: ``,
      name,
      email: `${name}@gmail.com`,
      secrets: {
        create: {},
      },
    },
  });
};

export const makeUsersFriends = async (
  prisma: PrismaService,
  user1: User,
  user2: User,
) => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user1.id },
      data: {
        friends: {
          connect: { id: user2.id },
        },
      },
    }),
    prisma.user.update({
      where: { id: user2.id },
      data: {
        friends: {
          connect: { id: user1.id },
        },
      },
    }),
  ]);
};

export const getUserFriends = async (prisma: PrismaService, userId: number) => {
  const { friends } = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: { friends: true },
  });
  return friends.map((u) => u.id);
};
