import { boardType } from "../components/board";

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
