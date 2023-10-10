import { Bodies } from 'matter-js';

export interface User {
  id: number;
  socketId: string;
}
export enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
}
export enum State {
  WAITING,
  PLAYING,
  OVER,
}

export interface scoreType {
  home: number;
  adversary: number;
}

export interface boardType {
  posi: [number, number, number];
  size: [number, number];
  txtu: string;
}
export interface ballType {
  posi: [x: number, y: number, z: number];
  size: [rad: number, w: number, h: number];
  txtu: string;
}
export interface playerType {
  id: number;
  posi: [x: number, y: number, z: number];
  size: [width: number, height: number, depth: number];
  txtu: string;
}

export const ballOptions = {
  mass: 0.2,
  force: { x: 0.001, y: 0.003 },
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
  scores: scoreType = {
    home: 0,
    adversary: 0,
  };
  bdDt: boardType = {
    posi: [0, 0, 0],
    size: [600, 800],
    txtu: 'green',
  };
  bl: ballType = {
    posi: [this.bdDt.size[0] / 2, this.bdDt.size[1] / 2, 20],
    size: [20, 15, 15],
    txtu: 'white',
  };
  home: playerType = {
    id: 0,
    posi: [this.bdDt.size[0] / 2, 70, 15],
    size: [100, 10, 30],
    txtu: 'red',
  };
  adversary: playerType = {
    id: 0,
    posi: [this.bdDt.size[0] / 2, this.bdDt.size[1] - 70, 15],
    size: [100, 10, 30],
    txtu: 'blue',
  };
}

const bdDt = new GameData().bdDt;

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
