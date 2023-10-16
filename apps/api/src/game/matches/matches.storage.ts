import { Match } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Game } from './match-game.interface';
import { WebsocketService } from '@src/websocket/websocket.service';
import { State } from '@transcendence/db';

@Injectable()
export class MatchesStorage {
  games: Game[] = [];

  constructor(private readonly websocketService: WebsocketService) {}

  private createGame(match: Match): Game {
    const game = new Game(
      this.websocketService,
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

  connectPlayer(match: Match, userId: number) {
    this.removePlayer(userId);
    let game = this.findGame(match.matchId);
    if (!game) {
      game = this.createGame(match);
    }
    game.users.push(userId);
    if (
      game.state === State.WAITING &&
      game.users.find((id) => id === match.homeId) &&
      game.users.find((id) => id === match.adversaryId)
    ) {
      game.state = State.PLAYING;

      // start game simulation
      game.gameService.startgame(match);
    }
  }

  removePlayer(userId: number) {
    this.games.forEach((game) => {
      const user = game.users.find((id) => id === userId);
      if (user) {
        game.users = game.users.filter((id) => id !== userId);
      }
      if (game.users.length === 0 && game.state !== State.PLAYING) {
        this.games = this.games.filter((g) => g.matchId !== game.matchId);
      }
      if (game.users.length === 1 && game.state === State.PLAYING) {
        game.state = State.OVER;
      }
    });
  }
}
