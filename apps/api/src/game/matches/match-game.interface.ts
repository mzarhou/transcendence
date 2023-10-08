import { Server } from 'socket.io';
import { GameData, State, User } from '../gameplay/gameData';
import { GamePlayService } from '../gameplay/gameplay.service';
import { MatchesService } from './matches.service';

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
