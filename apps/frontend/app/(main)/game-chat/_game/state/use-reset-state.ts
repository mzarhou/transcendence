import { useBallState } from "./ball";
import { useScoreState } from "./scores";

export function useResetGameState() {
  const ball = useBallState();
  const scores = useScoreState();

  return () => {
    ball.reset();
    scores.reset();
  };
}
