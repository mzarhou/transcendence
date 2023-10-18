import { Match } from "@prisma/client";
import { GameProfile } from "../types";

/**
 * events sent by Server
 */
export enum ServerGameEvents {
  MCHFOUND = "matchingFound",
  STARTSGM = "startGame",
  UPDTGAME = "updateGame",
  GAMEOVER = "gameOver",
  IN_GAME = "ingame",
  Invitation = "game-invitation",
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

export interface GameInvitationData {
  invitationId: string;
  profile: GameProfile;
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

export interface InGameEventData {
  friendId: number;
  inGame: boolean;
}
export interface MatchFoundData {
  match: Match;
}
export interface StartGameData extends MatchFoundData {}
export interface GameOverData {
  winnerId: number;
  match: Match;
}

export interface UpdateGameData {
  scores: ScoreType;
  bdDt: BoardType;
  bl: BallType;
  home: PlayerType;
  adversary: PlayerType;
  match: Match;
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
  posi: [x: number, y: number, z: number];
  size: [width: number, height: number, depth: number];
  txtu: string;
}
