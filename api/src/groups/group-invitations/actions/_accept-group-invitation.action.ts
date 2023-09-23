import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { PrismaService } from '@src/+prisma/prisma.service';

@Injectable()
export class AcceptGroupInvitationAction {
  constructor(private readonly prisma: PrismaService) {}

  async execute(user: ActiveUserData, invitationId: number) {
    const invitation = await this.requireInvitation(invitationId);
    const isBanned = Boolean(
      invitation.group.blockedUsers.find((u) => u.id === user.sub),
    );
    const isMember = Boolean(
      invitation.group.users.find((u) => u.userId === user.sub),
    );

    if (user.sub !== invitation.userId || isMember || isBanned) {
      throw new ForbiddenException('You cannot accept this invitation');
    }

    await this.acceptInvitation({
      invitationId,
      userId: user.sub,
      groupId: invitation.groupId,
    });
    return { success: true };
  }

  private async requireInvitation(invitationId: number) {
    const invitation = await this.prisma.groupInvitation.findFirst({
      where: { id: invitationId },
      include: {
        user: true,
        group: {
          include: { users: true, blockedUsers: true },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException();
    }
    return invitation;
  }

  private acceptInvitation(data: {
    invitationId: number;
    groupId: number;
    userId: number;
  }) {
    return this.prisma.$transaction([
      this.prisma.groupInvitation.delete({ where: { id: data.invitationId } }),
      this.prisma.group.update({
        where: { id: data.groupId },
        data: {
          users: {
            create: { userId: data.userId },
          },
        },
      }),
    ]);
  }
}
