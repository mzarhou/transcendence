import { ForbiddenException } from '@nestjs/common';
import { Group, GroupWithUsers } from '@transcendence/db';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { Prisma } from '@prisma/client';

type GroupUser = Prisma.UsersOnGroupsGetPayload<{
  include: { user: true };
}>;

export class BaseGroupsPolicy {
  throwUnlessCan(can: Boolean, message?: string) {
    if (!can) {
      throw new ForbiddenException();
    }
    return true;
  }

  protected isOwnerOrAdmin(
    user: ActiveUserData,
    group: Group & GroupWithUsers,
  ) {
    if (user.sub === group.ownerId) return true;
    return !!group.users.find((u) => u.id === user.sub && u.role === 'ADMIN');
  }

  protected isMember(userId: number, group: Group & GroupWithUsers) {
    return !!group.users.find((u) => u.id === userId);
  }

  protected isOwner(userId: number, group: Group) {
    return userId === group.ownerId;
  }

  protected isAdmin(userId: number, group: Group & GroupWithUsers) {
    return !!group.users.find((u) => u.id === userId && u.role === 'ADMIN');
  }

  protected requireOwner(userId: number, group: Group, message?: string) {
    return this.throwUnlessCan(userId === group.ownerId, message);
  }

  protected requireAdmin(
    userId: number,
    group: Group & GroupWithUsers,
    message?: string,
  ) {
    return this.throwUnlessCan(
      this.isOwner(userId, group) || this.isAdmin(userId, group),
      message,
    );
  }

  protected requireMember(
    userId: number,
    group: Group & GroupWithUsers,
    message?: string,
  ) {
    return this.throwUnlessCan(this.isMember(userId, group), message);
  }
}
