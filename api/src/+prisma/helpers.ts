import { Prisma } from '@prisma/client';

export type GroupWithUsers = Prisma.GroupGetPayload<{
  include: {
    users: {
      include: { user: true };
    };
  };
}>;

type UsersOnGroups = Prisma.UsersOnGroupsGetPayload<{
  include: { user: true };
}>;

export function mapGroup(group: GroupWithUsers) {
  return {
    ...group,
    users: group.users.map((u) => ({ ...u.user, role: u.role })),
  };
}

export function mapGroupUsers(groupUsers: UsersOnGroups[]) {
  return groupUsers.map((u) => ({ ...u, role: u.role }));
}
