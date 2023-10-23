import { WebsocketService } from '@src/websocket/websocket.service';
import { GameData } from '../gameplay/gameData';
import { GamePlayService } from '../gameplay/gameplay.service';
import { State } from '@transcendence/db';
import { Match } from '@transcendence/db';

export class Game {
  state: State;
  users: number[];
  gameData: GameData;
  gameService!: GamePlayService;
  match: Match;

  constructor(
    public readonly websocketService: WebsocketService,
    match: Match,
  ) {
    this.state = State.WAITING;
    this.users = [];
    this.gameData = new GameData(match);
    this.match = match;
  }

  setGameService() {
    this.gameService = new GamePlayService(this);
  }
}
