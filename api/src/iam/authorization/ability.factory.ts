import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { User } from '@prisma/client';

type Action = 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PureAbility<
  [
    Action,
    Subjects<{
      User: User;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class AbilityFactory {
  defineForUser(user: Omit<ActiveUserData, 'allow'>) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    /**
     * user can read his profile
     */
    can('read', 'User', { id: user.sub });
    return build();
  }
}
