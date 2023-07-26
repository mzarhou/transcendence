import { Prisma, User, UserGroupRole } from '@prisma/client';

export type UserGroup = User & { role: UserGroupRole };

export type GroupWithUsers = Prisma.GroupGetPayload<{
  include: {
    users: true;
  };
}>;

export type GroupWithBlockedUsers = Prisma.GroupGetPayload<{
  include: { blockedUsers: true };
}>;
