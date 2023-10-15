import { GameData, State } from '../gameplay/gameData';
import { GamePlayService } from '../gameplay/gameplay.service';
import { MatchesService } from './matches.service';

export class Game {
  state: State;
  matchesService: MatchesService;
  matchId: number;
  users: number[];
  gameData: GameData;
  homeId: number;
  adversaryId: number;
  gameService!: GamePlayService;
  winnerId: number | null;

  constructor(
    matchesService: MatchesService,
    matchId: number,
    homeId: number,
    adversaryId: number,
  ) {
    this.state = State.WAITING;
    this.matchesService = matchesService;
    this.matchId = matchId;
    this.users = [];
    this.homeId = homeId;
    this.winnerId = null;
    this.adversaryId = adversaryId;
    this.gameData = new GameData();
  }

  setGameService() {
    this.gameService = new GamePlayService(this);
  }
}
