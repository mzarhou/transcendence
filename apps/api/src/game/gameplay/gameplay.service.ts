import Matter, { Events, Engine, World, Bodies, Runner, Body } from 'matter-js';
import { walls, ballOptions, staticOption, GameData, State } from './gameData';
import { updateBallPosition, updatePlayerPosition } from './utils';
import { Game } from '../matches/match-game.interface';
import { Match } from '@transcendence/db';

export class GamePlayService {
  private engine: Engine;
  private ball: Matter.Body;
  private pl1: Matter.Body;
  private pl2: Matter.Body;
  private gmDt: GameData;
  private game: Game;
  private runner: Runner;

  constructor(game: Game) {
    this.gmDt = game.gameData;
    this.game = game;
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } });
    this.runner = Runner.create();
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
          this.game.winnerId = this.checkWinners(
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
          this.game.winnerId = this.checkWinners(
            scores.adversary,
            scores.home,
            match,
          );
        }
        console.log('adversary=>', scores.adversary);
        console.log('home=>', scores.home);
        if (this.game.winnerId !== null) {
          this.game.state = State.OVER;
        }
      });
    });

    Events.on(this.engine, 'beforeUpdate', () => {
      updateBallPosition(this.ball, this.game);
      updatePlayerPosition(this.pl1, this.pl2, this.game);
    });

    Runner.start(this.runner, this.engine);
  }

  stopGame() {
    Events.off(this.engine, 'beforeUpdate', () => {});
    Events.off(this.engine, 'collisionStart', () => {});
    console.log('event beforeUpdate killed');
    console.log('event collisionStart killed');
    this.runner.enabled = false;
    Engine.clear(this.engine);
    Runner.stop(this.runner);
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

  getGameData(): any {
    const data: string = JSON.stringify(this.gmDt);
    return data;
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
    if (adversary > home && adversary >= 7) return match.adversaryId;
    if (adversary < home && home >= 7) return match.homeId;
    return null;
  }
}
