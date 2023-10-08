import { Server, Socket } from 'socket.io';
import { MatchesService } from '@src/game/matches/matches.service';
import { Match } from '@prisma/client';
import { GameData, State, User } from '@src/game/gameplay/gameData';
import { Injectable } from '@nestjs/common';
import { GamePlayService } from '../gameplay/gameplay.service';

//table of games
export class Game {
  state: State;
  server: Server;
  matchesService: MatchesService;
  matchId: number;
  users: User[];
  gameData: GameData;
  homeId: number;
  adversaryId: number;
  gameService!: GamePlayService;

  constructor(
    server: Server,
    matchesService: MatchesService,
    matchId: number,
    homeId: number,
    adversaryId: number,
  ) {
    this.state = State.WAITING;
    this.server = server;
    this.matchesService = matchesService;
    this.matchId = matchId;
    this.users = [];
    this.homeId = homeId;
    this.adversaryId = adversaryId;
    this.gameData = new GameData();
  }

  setGameService() {
    this.gameService = new GamePlayService(this);
  }
}

@Injectable()
export class MatchesStorage {
  games: Game[] = [];
  server!: Server;
  
  setServer(server: Server){
    this.server = server;
  }

  constructor(
    private readonly matchesService: MatchesService
  ) {}

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



  private findGame(matchId: number): Game | undefined {
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
    client.join(this.getRoomId(game.matchId));
    if (
      game.state === State.WAITING &&
      game.users.find((user) => user.id === match.homeId) &&
      game.users.find((user) => user.id === match.adversaryId)
    ) {
      game.state = State.PLAYING;

      // start game simulation
      game.gameService.startgame();
    }
  }

  removePlayer(client: Socket) {
    this.games.forEach((game) => {
      const user = game.users.find((user) => user.socketId === client.id);
      if (user) {
        game.users = game.users.filter((user) => user.socketId !== client.id);
      }
      client.leave(this.getRoomId(game.matchId));
      if (game.users.length === 0 && game.state !== State.PLAYING) {
        this.games = this.games.filter((game) => game.matchId !== game.matchId);
      }
    });
  }

  getRoomId(matchId: number) {
    return `games.${matchId}`;
  }
}
