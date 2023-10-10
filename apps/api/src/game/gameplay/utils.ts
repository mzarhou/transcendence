import { Game } from '../matches/match-game.interface';

export function map_(
  value: number,
  inRange: Matter.Vector,
  outRange: Matter.Vector,
): number {
  const out =
    outRange.x +
    ((outRange.y - outRange.x) / (inRange.y - inRange.x)) * (value - inRange.x);
  return (out * inRange.y) / 2;
}

export function updateBallPosition(ball: Matter.Body, game: Game) {
  const blDt = game.gameData.bl;
  const bdDt = game.gameData.bdDt;
  blDt.posi[0] = map_(
    ball.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  blDt.posi[1] = map_(
    ball.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
}

export function updatePlayerPosition(
  pl1: Matter.Body,
  pl2: Matter.Body,
  game: Game,
) {
  const ply1 = game.gameData.home;
  const ply2 = game.gameData.adversary;
  const bdDt = game.gameData.bdDt;
  ply1.posi[0] = map_(
    pl1.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  ply1.posi[1] = map_(
    pl1.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
  ply2.posi[0] = map_(
    pl2.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  ply2.posi[1] = map_(
    pl2.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
  pl1.id = game.homeId;
  pl2.id = game.adversaryId;
}

export const enum EventGame {
  MCHFOUND = 'matchingFound',
  JNRNDMCH = 'joinRandomMatch',
  PLAYMACH = 'playMatch',
  STARTSGM = 'startGame',
  UPDTGAME = 'updateGame',
  GAMEOVER = 'gameOver',
}
