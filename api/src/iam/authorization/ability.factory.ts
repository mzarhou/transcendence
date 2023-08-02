import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import {
  User,
  FriendRequest,
  Message,
  Prisma,
  UsersOnGroups,
} from '@prisma/client';

type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'accept'
  | 'add-admin'
  | 'remove-admin'
  | 'ban-user'
  | 'unban-user'
  | 'kick-user'
  | 'join'
  | 'leave';

export type AppAbility = PureAbility<
  [
    Action,
    Subjects<{
      User: User;
      FriendRequest: FriendRequest;
      Message: Message;
      UsersOnGroups: UsersOnGroups;
      Group: Prisma.GroupGetPayload<{
        // include: {
        //   blockedUsers: boolean;
        // };
      }>;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class AbilityFactory {
  defineForUser({ sub: userId }: Omit<ActiveUserData, 'allow'>) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    /**
     * friend request
     */
    can('create', 'FriendRequest');
    can('read', 'FriendRequest', {
      OR: [{ requesterId: userId }, { recipientId: userId }],
    });
    can('delete', 'FriendRequest', {
      OR: [{ requesterId: userId }, { recipientId: userId }],
    });
    can('accept', 'FriendRequest', { recipientId: userId });

    /**
     * messages
     */
    can('update', 'Message', ['isRead'], { recipientId: userId });

    /**
     * groups
     */

    const ownerOrAdmin: Prisma.Enumerable<Prisma.GroupWhereInput> = [
      { ownerId: userId },
      {
        users: {
          some: { role: 'ADMIN', userId },
        },
      },
    ];

    /** members only can read group details (members, etc...) */
    can('read', 'Group', {
      users: {
        some: {
          userId,
        },
      },
    });
    can('delete', 'Group', { ownerId: userId });
    can('update', 'Group', { ownerId: userId });

    can('add-admin', 'Group', { ownerId: userId });
    can('remove-admin', 'Group', { ownerId: userId });

    can('ban-user', 'Group', { OR: ownerOrAdmin });
    can('unban-user', 'Group', { OR: ownerOrAdmin });

    can('kick-user', 'Group', { OR: ownerOrAdmin });

    can('leave', 'Group', {
      users: {
        some: { userId },
      },
    });

    can('join', 'Group');
    cannot('join', 'Group', {
      blockedUsers: {
        some: { id: userId },
      },
    });

    // can('update', 'Group', ['users'], { OR: ownerOrAdmin });
    // cannot('update', 'Group', ['users'], {
    //   blockedUsers: {
    //     some: { id: userId },
    //   },
    // });

    // can('update', 'Group', ['blockedUsers'], { OR: ownerOrAdmin });

    return build();
  }
}
