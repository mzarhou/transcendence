import { useBallState } from "./ball";
import { usePlayer1State, usePlayer2State } from "./player";
import { useScoreState } from "./scores";

export function useResetGameState() {
  const p1 = usePlayer1State();
  const p2 = usePlayer2State();
  const ball = useBallState();
  const scores = useScoreState();

  return () => {
    p1.reset();
    p2.reset();
    ball.reset();
    scores.reset();
  };
}
