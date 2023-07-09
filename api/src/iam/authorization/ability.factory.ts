import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { User, FriendRequest } from '@prisma/client';

type Action = 'create' | 'read' | 'update' | 'delete' | 'accept';

export type AppAbility = PureAbility<
  [
    Action,
    Subjects<{
      User: User;
      FriendRequest: FriendRequest;
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

    return build();
  }
}
