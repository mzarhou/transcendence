import { Server, Socket } from 'socket.io';
import { MatchesService } from '@src/game/matches/matches.service';
import { Match } from '@prisma/client';
import { State } from '@src/game/gameplay/gameData';
import { Injectable } from '@nestjs/common';
import { Game } from './match-game.interface';
import { getMatchRoomId } from './matches.helpers';

@Injectable()
export class MatchesStorage {
  games: Game[] = [];
  server!: Server;

  setServer(server: Server) {
    this.server = server;
  }

  constructor(private readonly matchesService: MatchesService) {}

  private createGame(match: Match): Game {
    const game = new Game(
      this.server,
      this.matchesService,
      match.matchId,
      match.homeId,
      match.adversaryId,
    );
    game.setGameService();
    this.games.push(game);
    return game;
  }

  findGame(matchId: number): Game | undefined {
    return this.games.find((game) => game.matchId === matchId);
  }

  connectPlayer(match: Match, userId: number, client: Socket) {
    this.removePlayer(client);
    let game = this.findGame(match.matchId);
    if (!game) {
      game = this.createGame(match);
    }
    game.users.push({
      id: userId,
      socketId: client.id,
    });
    client.join(getMatchRoomId(game.matchId));
    if (
      game.state === State.WAITING &&
      game.users.find((user) => user.id === match.homeId) &&
      game.users.find((user) => user.id === match.adversaryId)
    ) {
      game.state = State.PLAYING;

      // start game simulation
      game.gameService.startgame(match);
    }
  }

  removePlayer(client: Socket) {
    this.games.forEach((game) => {
      const user = game.users.find((user) => user.socketId === client.id);
      if (user) {
        game.users = game.users.filter((user) => user.socketId !== client.id);
      }
      client.leave(getMatchRoomId(game.matchId));
      if (game.users.length === 0 && game.state !== State.PLAYING) {
        this.games = this.games.filter((game) => game.matchId !== game.matchId);
      }
    });
  }
}
