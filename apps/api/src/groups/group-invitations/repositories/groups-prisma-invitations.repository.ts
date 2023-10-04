import { Injectable } from '@nestjs/common';
import {
  CreateGroupInvitation,
  GroupsInvitationsRepository,
  SearchableGroup,
} from './_groups-invitations.repository';
import { PrismaService } from '@src/+prisma/prisma.service';
import { UserGroupInvitation } from '@transcendence/db';

@Injectable()
export class GroupsInvitationsPrismaRepository extends GroupsInvitationsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createInvitation(data: CreateGroupInvitation) {
    const invitation = await this.prisma.groupInvitation.create({
      data: {
        groupId: data.groupId,
        userId: data.userId,
        invitedById: data.invitedById,
      },
      include: { group: true, user: true },
    });
    return invitation;
  }

  async findGroupWithUsers(groupId: number) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      include: { users: { include: { user: true } } },
    });
    return group;
  }

  async findSearchableGroup(groupId: number): Promise<SearchableGroup | null> {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      include: {
        users: { include: { user: true } },
        blockedUsers: true,
        invitations: true,
      },
    });
    return group;
  }

  async findUserInvitations(userId: number): Promise<UserGroupInvitation[]> {
    const invitations = await this.prisma.groupInvitation.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true },
        },
        group: { include: { users: { include: { user: true } } } },
      },
    });

    return invitations;
  }
}
