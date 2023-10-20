import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/+prisma/prisma.service';
import { ChatService } from '@src/chat/chat.service';
import { MatchesService } from '@src/game/matches/matches.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { UsersService } from '@src/users/users.service';
import { GameProfile } from '@transcendence/db';

@Injectable()
export class RankService {
  //dependcy injection
  constructor(
    private prisma: PrismaService,
    private matches: MatchesService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
  ) {}

  async getGameProfile(currentUser: ActiveUserData, userId: number) {
    if (await this.usersService.isUserBlocked(currentUser.sub, userId)) {
      throw new ForbiddenException("You can't send this friend request");
    }

    const { numOfGames, eloRating, ...user } =
      await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          matches3: {
            where: {
              winnerId: userId,
            },
          },
        },
      });

    const nbWins = user.matches3.length;
    const isFriend = await this.chatService.isFriendOf(currentUser, userId);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      division: user.division,
      eloRating,
      rank: user.rank,
      rankBoard: user.rankBoard,
      numOfGames,
      nbWins,
      nbLoses: numOfGames - nbWins,
      isFriend,
    } satisfies GameProfile;
  }

  async getProvElo() {
    return this.prisma.user.findMany({
      where: {
        rankBoard: 'Provisional',
      },
      orderBy: {
        eloRating: 'desc',
      },
    });
  }

  async getEstaElo() {
    return this.prisma.user.findMany({
      where: {
        rankBoard: 'Established',
      },
      orderBy: {
        eloRating: 'desc',
      },
    });
  }

  async incrementNumOfGames(userId: number) {
    const player = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!player) {
      return;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        numOfGames: player.numOfGames + 1,
      },
    });
  }

  async newElo(newElo: number, userId: number) {
    const player = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const uptPlayer = await this.prisma.user.update({
      where: { id: userId },
      data: {
        eloRating: newElo,
      },
    });
  }

  async updateRank(): Promise<void> {
    const estaPlayers = await this.getEstaElo();
    const provPlayers = await this.getProvElo();

    let newRank = 1;

    if (estaPlayers.length !== 0) {
      for (const player of estaPlayers) {
        await this.prisma.user.update({
          where: { id: player.id },
          data: { rank: newRank },
        });
        newRank++;
      }
    }

    if (provPlayers.length !== 0) {
      for (const player of provPlayers) {
        await this.prisma.user.update({
          where: { id: player.id },
          data: { rank: newRank },
        });
        newRank++;
      }
    }
  }

  async updateRankBoard() {
    return this.prisma.user.updateMany({
      where: {
        rankBoard: 'Provisional',
        numOfGames: {
          gt: 20,
        },
      },
      data: {
        rankBoard: 'Established',
      },
    });
  }

  async updateDivision(): Promise<void> {
    const players = await this.prisma.user.findMany();
    for (const player of players) {
      if (player.rankBoard == 'Established') {
        if (player.eloRating < 800 && player.division != 'Nooby') {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: 'Nooby' },
          });
        }
        if (
          player.eloRating >= 800 &&
          player.eloRating < 1650 &&
          player.division != 'Bronze'
        ) {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: 'Bronze' },
          });
        }
        if (
          player.eloRating >= 1650 &&
          player.eloRating < 2500 &&
          player.division != 'Gold'
        ) {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: 'Gold' },
          });
        }
        if (player.eloRating >= 2500 && player.division != 'Legend') {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: 'Legend' },
          });
        }
      }
    }
  }

  async updateElo(data: { matchId: number; winnerId: number }) {
    const { winnerId, matchId } = data;

    const match = await this.prisma.match.update({
      where: { matchId },
      data: { winnerId },
    });

    const players = await this.prisma.user.findMany({
      where: {
        OR: [{ id: match.homeId }, { id: match.adversaryId }],
      },
    });

    const home = players.find((u) => u.id === match.homeId);
    const adversary = players.find((u) => u.id === match.adversaryId);
    if (!home || !adversary) {
      throw new Error('Invalid home or adversary');
    }

    let s1 = 0,
      s2 = 0,
      newR1 = 0,
      newR2 = 0;

    await this.incrementNumOfGames(home.id);
    await this.incrementNumOfGames(adversary.id);

    if (
      home.rankBoard == 'Provisional' &&
      adversary.rankBoard == 'Provisional'
    ) {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = -1;
      } else if (adversary.id == match.winnerId) {
        s1 = -1;
        s2 = 1;
      }
      newR1 =
        (home.eloRating * home.numOfGames +
          (home.eloRating + adversary.eloRating) / 2 +
          100 * s1) /
        (home.numOfGames + 1);
      newR2 =
        (home.eloRating * home.numOfGames +
          (home.eloRating + adversary.eloRating) / 2 +
          100 * s2) /
        (home.numOfGames + 1);
    } else if (
      home.rankBoard == 'Provisional' &&
      adversary.rankBoard == 'Established'
    ) {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = 0;
      } else if (adversary.id == match.winnerId) {
        s1 = -1;
        s2 = 1;
      }
      newR1 =
        (home.eloRating * home.numOfGames + adversary.eloRating + 200 * s1) /
        (home.numOfGames + 1);
      newR2 =
        home.eloRating +
        32 *
          (adversary.numOfGames / 20) *
          (s2 -
            1 /
              (1 + Math.pow(10, (adversary.eloRating - home.eloRating) / 400)));
    } else if (
      home.rankBoard == 'Established' &&
      adversary.rankBoard == 'Provisional'
    ) {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = -1;
      } else if (adversary.id == match.winnerId) {
        s1 = 0;
        s2 = 1;
      }
      newR1 =
        home.eloRating +
        32 *
          (adversary.numOfGames / 20) *
          (s2 -
            1 /
              (1 + Math.pow(10, (adversary.eloRating - home.eloRating) / 400)));
      newR2 =
        (home.eloRating * home.numOfGames + adversary.eloRating + 200 * s1) /
        (home.numOfGames + 1);
    } else if (
      home.rankBoard == 'Established' &&
      adversary.rankBoard == 'Established'
    ) {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = 0;
      } else if (adversary.id == match.winnerId) {
        s1 = 0;
        s2 = 1;
      }
      newR1 =
        home.eloRating +
        32 *
          (s1 -
            1 /
              (1 + Math.pow(10, (adversary.eloRating - home.eloRating) / 400)));
      newR2 =
        home.eloRating +
        32 *
          (s2 -
            1 /
              (1 + Math.pow(10, (adversary.eloRating - home.eloRating) / 400)));
    }
    await this.newElo(newR1, home.id);
    await this.newElo(newR2, adversary.id);
    await this.updateRankBoard();
    await this.updateDivision();
    await this.updateRank();
  }
}