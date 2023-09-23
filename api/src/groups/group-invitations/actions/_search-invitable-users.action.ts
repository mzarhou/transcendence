import { Injectable, NotFoundException } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { PrismaService } from '@src/+prisma/prisma.service';
import { GroupInvitationsPolicy } from '../group-invitations.policy';

@Injectable()
export class SearchInvitableUsersAction {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly policy: GroupInvitationsPolicy,
    private readonly prisma: PrismaService,
  ) {}

  async execute(user: ActiveUserData, groupId: number, searchTerm: string) {
    if (!searchTerm?.length) {
      return [];
    }

    const group = await this.requireGroup(groupId);
    this.policy.canInviteUsers(user, group);

    const memebers = group.users.map((u) => u.userId);
    const bannedUsers = group.blockedUsers.map((u) => u.id);
    const invitedUsers = group.invitations.map((it) => it.userId);
    const usersToExclude = Array.from(
      new Set([memebers, bannedUsers, invitedUsers].flat()),
    );

    const users = await this.usersRepository.search({
      searchTerm,
      excludeUsersIds: usersToExclude,
    });

    return users;
  }

  private async requireGroup(groupId: number) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      include: {
        users: { include: { user: true } },
        blockedUsers: true,
        invitations: true,
      },
    });
    if (!group) {
      throw new NotFoundException('group not found');
    }
    return group;
  }
}
