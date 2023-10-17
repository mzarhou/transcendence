import {
  BallType,
  BoardType,
  Match,
  PlayerType,
  ScoreType,
} from '@transcendence/db';
import { Bodies } from 'matter-js';

export const ballOptions = {
  mass: 0.2,
  force: { x: 0.002, y: 0.004 },
  density: 0.001,
  friction: 0,
  restitution: 1,
  frictionAir: 0,
  inertia: Infinity,
};

export const staticOption = {
  isStatic: true,
};

export class GameData {
  constructor(public match: Match) {}

  scores: ScoreType = {
    home: 0,
    adversary: 0,
  };
  bdDt: BoardType = {
    posi: [0, 0, 0],
    size: [600, 800],
    txtu: 'green',
  };
  bl: BallType = {
    posi: [this.bdDt.size[0] / 2, this.bdDt.size[1] / 2, 20],
    size: [20, 15, 15],
    txtu: 'white',
  };
  home: PlayerType = {
    posi: [this.bdDt.size[0] / 2, 70, 15],
    size: [100, 10, 30],
    txtu: 'red',
  };
  adversary: PlayerType = {
    posi: [this.bdDt.size[0] / 2, this.bdDt.size[1] - 70, 15],
    size: [100, 10, 30],
    txtu: 'blue',
  };
}

const bdDt = new GameData({
  homeId: 0,
  winnerId: 0,
  adversaryId: 0,
  matchId: 0,
}).bdDt;

export const walls = [
  Bodies.rectangle(bdDt.size[0] / 2, 0, bdDt.size[0], 40, { isStatic: true }), // Top wall
  Bodies.rectangle(bdDt.size[0] / 2, bdDt.size[1], bdDt.size[0], 40, {
    isStatic: true,
  }), // Bottom wall
  Bodies.rectangle(0, bdDt.size[1] / 2, 40, bdDt.size[1], { isStatic: true }), // Left wall
  Bodies.rectangle(bdDt.size[0], bdDt.size[1] / 2, 40, bdDt.size[1], {
    isStatic: true,
  }), // Right wall
];
