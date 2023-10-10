import { playerType, statusType } from "../components/player";
import { ballType } from "../components/ball";
import { boardType } from "../components/board";

export let player1: playerType = {
  nmPl: 0,
  posi: [0, -330, 15],
  size: [100, 10, 30],
  txtu: "red",
};

export let player2: playerType = {
  nmPl: 0,
  posi: [0, 330, 15],
  size: [100, 10, 30],
  txtu: "blue",
};

export let ballEntity: ballType = {
  position: [0, 0, 20],
  size: [20, 15, 15],
  color: "white",
};

export let boardEntity: boardType = {
  position: [0, 0, 0],
  size: [600, 800],
  txtu: "background.png",
};

export const enum EventGame {
  MCHFOUND = "matchingFound",
  JNRNDMCH = "joinRandomMatch",
  PLAYMACH = "playMatch",
  STARTSGM = "startGame",
  UPDTGAME = "updateGame",
  GAMEOVER = "gameOver",
}

export const enum states {
  CONNECT = "connect",
  WAITING = "waiting",
  STRGAME = "startGame",
  UPDGAME = "update",
  GAMOVER = "GameOver",
}

export let status: statusType = {
  name: states.CONNECT,
};
