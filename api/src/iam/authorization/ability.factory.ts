import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { User, FriendRequest, Message } from '@prisma/client';

type Action = 'create' | 'read' | 'update' | 'delete' | 'accept';

export type AppAbility = PureAbility<
  [
    Action,
    Subjects<{
      User: User;
      FriendRequest: FriendRequest;
      Message: Message;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class AbilityFactory {
  defineForUser({ sub: userId }: Omit<ActiveUserData, 'allow'>) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

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

    return build();
  }
}
