import Matter, { Events, Engine, World, Bodies, Body } from 'matter-js';
import { walls, ballOptions, staticOption, GameData } from './gameData';
import { updateBallPosition, updatePlayerPosition } from './utils';
import { Game } from '../matches/match-game.interface';
import { Match, ServerGameEvents, State } from '@transcendence/db';
import { UpdateGameData } from '@transcendence/db';
import { Logger } from '@nestjs/common';

export class GamePlayService {
  private readonly logger = new Logger(GamePlayService.name);
  private engine: Engine;
  private ball: Matter.Body;
  private pl1: Matter.Body;
  private pl2: Matter.Body;
  private gmDt: GameData;
  private game: Game;
  readonly frameRate = 1000 / 30;
  interval!: NodeJS.Timeout;

  constructor(game: Game) {
    this.gmDt = game.gameData;
    this.game = game;
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } });
    this.ball = Bodies.circle(
      this.gmDt.bl.posi[0],
      this.gmDt.bl.posi[1],
      this.gmDt.bl.size[0],
      ballOptions,
    );
    this.pl1 = Bodies.rectangle(
      this.gmDt.home.posi[0],
      this.gmDt.home.posi[1],
      this.gmDt.home.size[0],
      this.gmDt.home.size[1],
      staticOption,
    );
    this.pl2 = Bodies.rectangle(
      this.gmDt.adversary.posi[0],
      this.gmDt.adversary.posi[1],
      this.gmDt.adversary.size[0],
      this.gmDt.adversary.size[1],
      staticOption,
    );
    World.add(this.engine.world, walls);
    World.add(this.engine.world, [this.ball, this.pl1, this.pl2]);
  }

  startgame(match: Match) {
    this.logger.debug('start game: ', this.game.match.matchId);
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((collision) => {
        const ball = collision.bodyA as Body;
        const wall = collision.bodyB as Body;
        const scores = this.gmDt.scores;
        if (
          (ball === this.ball && wall === walls[0]) ||
          (ball == walls[0] && wall == this.ball)
        ) {
          this.applyCollisionEffect(this.gmDt, 'adversary');
          this.game.match.winnerId = this.checkWinners(
            scores.adversary,
            scores.home,
            match,
          );
        }
        if (
          (ball === this.ball && wall === walls[1]) ||
          (ball == walls[1] && wall == this.ball)
        ) {
          this.applyCollisionEffect(this.gmDt, 'home');
          this.game.match.winnerId = this.checkWinners(
            scores.adversary,
            scores.home,
            match,
          );
        }
        if (this.game.match.winnerId !== null) {
          this.game.state = State.OVER;
        }
      });
    });

    Events.on(this.engine, 'beforeUpdate', () => {
      updateBallPosition(this.ball, this.game);
      updatePlayerPosition(this.pl1, this.pl2, this.game);
    });

    this.interval = setInterval(() => this.gameUpdate(), this.frameRate);
  }

  private gameUpdate() {
    Engine.update(this.engine, this.frameRate);
    if (this.game.state === State.PLAYING) {
      this.game.websocketService.addEvent(
        [this.game.match.adversaryId, this.game.match.homeId],
        ServerGameEvents.UPDTGAME,
        this.gmDt satisfies UpdateGameData,
      );
    }

    if (this.game.state === State.OVER) {
      this.game.websocketService.addEvent(
        [this.game.match.adversaryId, this.game.match.homeId],
        ServerGameEvents.GAMEOVER,
        { winnerId: this.game.match.winnerId },
      );
      this.game.gameService.stopGame();
    }
  }

  stopGame() {
    this.logger.debug('stop game: ', this.game.match.matchId);
    clearInterval(this.interval);
    Events.off(this.engine, 'beforeUpdate', () => {});
    Events.off(this.engine, 'collisionStart', () => {});
    Engine.clear(this.engine);
  }

  movePlayer(direction: string, client: number, match: Match) {
    if (client == match.homeId) this.processDataplayer(this.pl1, direction);
    if (client == match.adversaryId)
      this.processDataplayer(this.pl2, direction);
  }

  private processDataplayer(player: Matter.Body, direction: string) {
    if (
      direction == 'right' &&
      player.position.x + 60 < this.gmDt.bdDt.size[0]
    ) {
      Body.setPosition(player, {
        x: player.position.x + 10,
        y: player.position.y,
      });
      if (player.position.x + 60 > this.gmDt.bdDt.size[0])
        Body.setPosition(player, {
          x: this.gmDt.bdDt.size[0] - 60,
          y: player.position.y,
        });
    }
    if (direction == 'left' && player.position.x + 60 > 0) {
      Body.setPosition(player, {
        x: player.position.x - 10,
        y: player.position.y,
      });
      if (player.position.x - 60 < 0)
        Body.setPosition(player, { x: 60, y: player.position.y });
    }
  }

  applyCollisionEffect(gmDt: GameData, op: string) {
    if (op == 'adversary') gmDt.scores.adversary += 1;
    if (op == 'home') gmDt.scores.home += 1;
    Matter.Body.setPosition(this.ball, {
      x: this.gmDt.bdDt.size[0] / 2,
      y: this.gmDt.bdDt.size[1] / 2,
    });
  }
  checkWinners(adversary: number, home: number, match: Match): number | null {
    if (adversary > home && adversary >= 100) return match.adversaryId;
    if (adversary < home && home >= 100) return match.homeId;
    return null;
  }
}
