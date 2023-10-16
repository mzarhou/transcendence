import { Match } from "@prisma/client";

/**
 * events sent by Server
 */
export enum ServerGameEvents {
  MCHFOUND = "matchingFound",
  STARTSGM = "startGame",
  UPDTGAME = "updateGame",
  GAMEOVER = "gameOver",
}

/**
 * events sent by client
 */
export enum ClientGameEvents {
  JNRNDMCH = "joinRandomMatch",
  PLAYMACH = "playMatch",
  MoveLeft = "MoveLeft",
  MoveRight = "MoveRight",
}
export interface PlayMatchData {
  matchId: number;
}
export interface MoveLeftData {
  match: Match;
}
export interface MoveRightData {
  match: Match;
}

export interface UpdateGameData {}
export interface MatchFoundData {
  match: Match;
}
export interface StartGameData extends MatchFoundData {}
export interface GameOverData {
  winnerId: number;
}

export interface UpdateGameData {
  scores: ScoreType;
  bdDt: BoardType;
  bl: BallType;
  home: PlayerType;
  adversary: PlayerType;
}

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
}
export enum State {
  WAITING,
  PLAYING,
  OVER,
}

export interface ScoreType {
  home: number;
  adversary: number;
}

export interface BoardType {
  posi: [number, number, number];
  size: [number, number];
  txtu: string;
}

export interface BallType {
  posi: [x: number, y: number, z: number];
  size: [rad: number, w: number, h: number];
  txtu: string;
}

export interface PlayerType {
  id: number;
  posi: [x: number, y: number, z: number];
  size: [width: number, height: number, depth: number];
  txtu: string;
}
