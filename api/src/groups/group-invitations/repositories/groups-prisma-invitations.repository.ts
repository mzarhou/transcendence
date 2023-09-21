import { Injectable } from '@nestjs/common';
import {
  CreateGroupInvitation,
  GroupsInvitationsRepository,
} from './_groups-invitations.repository';
import { PrismaService } from '@src/+prisma/prisma.service';

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
      include: { group: true },
    });
    return invitation;
  }

  async findGroupWithUsers(groupId: number) {
    const group = await this.prisma.group.findFirstOrThrow({
      where: { id: groupId },
      include: { users: { include: { user: true } } },
    });
    return group;
  }
}
