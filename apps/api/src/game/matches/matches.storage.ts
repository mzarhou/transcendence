import { Match } from '@prisma/client';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Game } from './match-game.interface';
import { WebsocketService } from '@src/websocket/websocket.service';
import { GameOverData, ServerGameEvents, State } from '@transcendence/db';
import { Subscription } from 'rxjs';

@Injectable()
export class MatchesStorage implements OnApplicationShutdown {
  games: Game[] = [];

  private subscription!: Subscription;

  constructor(private readonly websocketService: WebsocketService) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event) => {
        if (event.name === ServerGameEvents.GAMEOVER) {
          const data = event.data as GameOverData;
          this.removeGame(data.match.matchId);
        }
      },
    });
  }

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  private createGame(match: Match): Game {
    const game = new Game(this.websocketService, match);
    game.setGameService();
    this.games.push(game);
    return game;
  }

  findGame(matchId: number): Game | undefined {
    return this.games.find((game) => game.match.matchId === matchId);
  }

  connectPlayer(match: Match, userId: number) {
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

  private removeGame(matchId: number) {
    this.games = this.games.filter((g) => g.match.matchId !== matchId);
  }

  removePlayer(disconnectedUserId: number) {
    const game = this.games.find((g) => g.users.includes(disconnectedUserId));
    if (!game) return;

    game.gameService.stopGame(disconnectedUserId);
    this.removeGame(game.match.matchId);
  }

  isUserInGame(userId: number) {
    const game = this.games.find((g) => g.users.includes(userId));
    return !!game;
  }
}
