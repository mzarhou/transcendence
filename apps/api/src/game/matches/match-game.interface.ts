import { WebsocketService } from '@src/websocket/websocket.service';
import { GameData } from '../gameplay/gameData';
import { GamePlayService } from '../gameplay/gameplay.service';
import { MatchesService } from './matches.service';
import { State } from '@transcendence/db';
import { Match } from '@transcendence/db';

export class Game {
  state: State;
  matchId: number;
  users: number[];
  gameData: GameData;
  homeId: number;
  adversaryId: number;
  gameService!: GamePlayService;
  winnerId: number | null;

  // TODO: refactor use match only
  constructor(
    public readonly websocketService: WebsocketService,
    match: Match,
    matchId: number,
    homeId: number,
    adversaryId: number,
  ) {
    this.state = State.WAITING;
    this.matchId = matchId;
    this.users = [];
    this.homeId = homeId;
    this.winnerId = null;
    this.adversaryId = adversaryId;
    this.gameData = new GameData(match);
  }

  setGameService() {
    this.gameService = new GamePlayService(this);
  }
}
