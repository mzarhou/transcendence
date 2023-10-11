import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/+prisma/prisma.service';
import { MatchesService } from '@src/game/matches/matches.service';

@Injectable()
export class RankService {
  //dependcy injection
  constructor(
    private prisma: PrismaService,
    private matches: MatchesService,
  ) { }

  async getAllRank() {
    return this.prisma.user.findMany();
  }

  async getNumOfMatchesPlayed(id: number): Promise<any> {
    const player = await this.prisma.user.findUnique({
      where: { id },
    });
    return (player?.numOfGames);
  }

  async getEloScore(id: number): Promise<any> {
    const player = await this.prisma.user.findUnique({
      where: { id },
    });
    return (player?.eloRating);
  }

  async getNumOfWins(id: number): Promise<any> {
    const player = await this.prisma.user.findUnique({
      where: { id },
      include: {
        matches3: {
          where: {
            winnerId: id,
          }
        }
      }
    });
    return (player?.matches3.length);
  }

  async getProvElo() {
    return this.prisma.user.findMany({
      where: {
        rankBoard: 'Provisional',
      },
      orderBy: {
        eloRating: 'desc',
      }
    });
  }

  async getEstaElo() {
    return this.prisma.user.findMany({
      where: {
        rankBoard: 'Established',
      },
      orderBy: {
        eloRating: 'desc',
      }
    });
  }

  async incrementNumOfGames(userId: number) {
    const player = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!player)
      return;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        numOfGames: player.numOfGames + 1,
      }
    })
  }

  async newElo(newElo: number, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        eloRating: newElo,
      }
    })
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
        }
      },
      data: {
        rankBoard: 'Established'
      },
    })
  }

  async updateDivision(): Promise<void> {
    const players = await this.prisma.user.findMany();
    for (const player of players) {
      if (player.rankBoard == "Established") {
        if (player.eloRating < 800 && player.division != "Nooby") {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: "Nooby" },
          })
        }
        if ((player.eloRating >= 800 && player.eloRating < 1250) && player.division != "Bronze") {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: "Bronze" },
          })
        }
        if ((player.eloRating >= 1250 && player.eloRating < 1800) && player.division != "Gold") {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: "Gold" },
          })
        }
        if ((player.eloRating >= 1800) && player.division != "Legend") {
          await this.prisma.user.update({
            where: { id: player.id },
            data: { division: "Legend" },
          })
        }
      }
    }
  }

  async updateElo(matchId: number) {
    const match = await this.matches.findOneById(matchId);
    const home = await this.prisma.user.findUnique({
      where: {
        id: match.homeId,
      }
    })

    const adversary = await this.prisma.user.findUnique({
      where: {
        id: match.adversaryId,
      }
    })
    if (!home || !adversary)
      return ;
    let s1 = 0, s2 = 0, newR1 = 0, newR2 = 0;

    await this.incrementNumOfGames(match.homeId);
    await this.incrementNumOfGames(match.adversaryId);

    if (home.rankBoard == "Provisional" && adversary.rankBoard == "Provisional") {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = -1;
      }
      else if (adversary.id == match.winnerId) {
        s1 = -1;
        s2 = 1;
      }
      newR1 = ((home.eloRating * home.numOfGames + (home.eloRating + adversary.eloRating) / 2) + 100 * s1) / (home.numOfGames + 1)
      newR2 = ((home.eloRating * home.numOfGames + (home.eloRating + adversary.eloRating) / 2) + 100 * s2) / (home.numOfGames + 1)
    }

    else if (home.rankBoard == "Provisional" && adversary.rankBoard == "Established") {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = 0;
      }
      else if (adversary.id == match.winnerId) {
        s1 = -1;
        s2 = 1;
      }
      newR1 = (home.eloRating * home.numOfGames + adversary.eloRating + 200 * s1) / (home.numOfGames + 1)
      newR2 = home.eloRating + (32 * (adversary.numOfGames / 20)) * (s2 - 1 / (1 + Math.pow(10, ((adversary.eloRating - home.eloRating) / 400))))
    }

    else if (home.rankBoard == "Established" && adversary.rankBoard == "Provisional") {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = -1;
      }
      else if (adversary.id == match.winnerId) {
        s1 = 0;
        s2 = 1;
      }
      newR1 = home.eloRating + (32 * (adversary.numOfGames / 20)) * (s2 - 1 / (1 + Math.pow(10, ((adversary.eloRating - home.eloRating) / 400))))
      newR2 = (home.eloRating * home.numOfGames + adversary.eloRating + 200 * s1) / (home.numOfGames + 1)
    }

    else if (home.rankBoard == "Established" && adversary.rankBoard == "Established") {
      if (home.id == match.winnerId) {
        s1 = 1;
        s2 = 0;
      }
      else if (adversary.id == match.winnerId) {
        s1 = 0;
        s2 = 1;
      }
      newR1 = home.eloRating + 32 * (s1 - 1 / (1 + Math.pow(10, ((adversary.eloRating - home.eloRating) / 400))))
      newR2 = home.eloRating + 32 * (s2 - 1 / (1 + Math.pow(10, ((adversary.eloRating - home.eloRating) / 400))))
    }

    await this.newElo(newR1, home.id)
    await this.newElo(newR2, adversary.id)
    await this.updateRankBoard()
    await this.updateDivision()
    await this.updateRank()
  }
}