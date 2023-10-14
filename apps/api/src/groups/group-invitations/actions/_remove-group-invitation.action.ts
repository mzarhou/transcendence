import { Injectable, NotFoundException } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupInvitationsPolicy } from '../group-invitations.policy';
import { PrismaService } from '@src/+prisma/prisma.service';

@Injectable()
export class RemoveGroupInvitationAction {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: GroupInvitationsPolicy,
  ) {}

  async execute(user: ActiveUserData, invitationId: number) {
    const invitation = await this.prisma.groupInvitation.findFirst({
      where: { id: invitationId },
      include: {
        user: true,
        group: { include: { users: { include: { user: true } } } },
      },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');
    this.policy.canDelete(user, invitation);
    await this.prisma.groupInvitation.delete({ where: { id: invitationId } });
    return { success: true };
  }
}
