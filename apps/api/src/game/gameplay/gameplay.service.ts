import { Injectable } from '@nestjs/common';
import Matter, { Events, Engine, World, Bodies, Runner, Body } from 'matter-js';
import { walls, ballOptions, staticOption, GameData } from './gameData';
import { updateBallPosition, updatePlayerS1SPosition } from './utils';
import { Game } from '../matches/entities/game.entity';

@Injectable()
export class GamePlayService {
  private engine: Engine;
  private ball: Matter.Body;
  private pl1: Matter.Body;
  private pl2: Matter.Body;
  private gmDt: GameData;
  private game: Game;

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

  startgame() {
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((collision) => {
        const ball = collision.bodyA as Body;
        const wall = collision.bodyB as Body;
        if (
          (ball === this.ball && wall === walls[0]) ||
          (ball == walls[0] && wall == this.ball)
        ) {
          console.log('Collision between Ball and WallPlayer1 detected!');
          Matter.Body.setPosition(this.ball, {
            x: this.gmDt.bdDt.size[0] / 2,
            y: this.gmDt.bdDt.size[1] / 2,
          });
        }
        if (
          (ball === this.ball && wall === walls[1]) ||
          (ball == walls[1] && wall == this.ball)
        ) {
          console.log('Collision between Ball and WallPlayer2 detected!');
          Matter.Body.setPosition(this.ball, {
            x: this.gmDt.bdDt.size[0] / 2,
            y: this.gmDt.bdDt.size[1] / 2,
          });
        }
      });
    });

    Events.on(this.engine, 'beforeUpdate', () => {
      updateBallPosition(this.ball);
      updatePlayerS1SPosition(this.pl1, this.pl2);
    });

    Runner.run(this.engine);
  }

  stopGame() {
    Engine.clear(this.engine);
    Runner.stop(Runner.run(this.engine));
  }

  movePlayer(direction: string, client: number, matchId: number) {
    if (client == matchId) this.processDataplayer(this.pl1, direction);
    if (client == matchId) this.processDataplayer(this.pl2, direction);
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

  getGameDataS1(): any {
    const data: string = JSON.stringify(this.gmDt);
    return data;
  }
}
