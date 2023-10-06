import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/+prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, adverId: number) {
    const match = await this.prisma.match.create({
      data: {
        homeId: userId,
        adversaryId: adverId,
      },
    });

    return match;
  }

  async findOneById(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: {
        matchId: matchId,
      },
    });

    if (!match) {
      throw new NotFoundException();
    }

    return match;
  }
}
