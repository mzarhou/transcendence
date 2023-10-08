import { bdDt, blDtS1, ply1S1, ply2S1 } from './gameData';

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

export function updateBallPosition(ball: Matter.Body) {
  blDtS1.posi[0] = map_(
    ball.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  blDtS1.posi[1] = map_(
    ball.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
}

export function updatePlayerS1SPosition(pl1: Matter.Body, pl2: Matter.Body) {
  ply1S1.posi[0] = map_(
    pl1.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  ply1S1.posi[1] = map_(
    pl1.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
  ply2S1.posi[0] = map_(
    pl2.position.x,
    { x: 0, y: bdDt.size[0] },
    { x: -1, y: 1 },
  );
  ply2S1.posi[1] = map_(
    pl2.position.y,
    { x: 0, y: bdDt.size[1] },
    { x: -1, y: 1 },
  );
}
