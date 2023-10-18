import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/+prisma/prisma.service';
import { MatchesStorage } from './matches.storage';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WebsocketService } from '@src/websocket/websocket.service';
import { ServerGameEvents } from '@transcendence/db';
import { GameCanceledData } from '@transcendence/db';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private readonly storage: MatchesStorage,
    private readonly websocketService: WebsocketService,
  ) {}

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
    const match = await this.safeFindOneById(matchId);
    if (!match) {
      throw new NotFoundException();
    }

    return match;
  }

  async safeFindOneById(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: {
        matchId: matchId,
      },
    });

    return match;
  }

  async cancelGame(user: Pick<ActiveUserData, 'sub'>, matchId: number) {
    const isGameExists = !!this.storage.findGame(matchId);
    if (isGameExists) {
      throw new ForbiddenException('You can not cancel this game');
    }
    const match = await this.safeFindOneById(matchId);
    if (!match) {
      this.websocketService.addEvent(
        [user.sub],
        ServerGameEvents.GAME_CANCELED,
        { canceledById: user.sub } satisfies GameCanceledData,
      );
      return;
    }
    if (
      match.winnerId ||
      (user.sub !== match.homeId && user.sub !== match.adversaryId)
    ) {
      throw new ForbiddenException('You can not cancel this game');
    }
    await this.prisma.match.delete({ where: { matchId } });

    this.websocketService.addEvent(
      [match.adversaryId, match.homeId],
      ServerGameEvents.GAME_CANCELED,
      { canceledById: user.sub } satisfies GameCanceledData,
    );

    return { success: true };
  }
}
