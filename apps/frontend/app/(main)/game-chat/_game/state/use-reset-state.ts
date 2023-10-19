import { useBallState } from "./ball";
import { useMatchState } from "./match";
import { usePlayer1State, usePlayer2State } from "./player";
import { useScoreState } from "./scores";

export function useResetGameState() {
  const ball = useBallState();
  const player1 = usePlayer1State();
  const player2 = usePlayer2State();
  const match = useMatchState();

  return () => {
    ball.reset();
    player1.reset();
    player2.reset();
    match.reset();
  };
}
