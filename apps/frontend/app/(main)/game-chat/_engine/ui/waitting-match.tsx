import { useMatchFoundEvent } from "../utils/websocket-events";
import { useSocket } from "@/context";
import {
  STATUS,
  useBallState,
  useMatchState,
  usePlayer1State,
  usePlayer2State,
  useScoreState,
  useStatus,
} from "../state";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClientGameEvents } from "@transcendence/db";

export function WaitingMatch() {
  const socket = useSocket();
  const { matchId } = useMatchState();
  const status = useStatus();
  const navigate = useNavigate();
  const player1 = usePlayer1State();
  const player2 = usePlayer2State();
  const ball = useBallState();
  const scores = useScoreState();

  useMatchFoundEvent();
  const waitingMatch = () => {
    player1.reset();
    player2.reset();
    ball.reset();
    scores.reset();
    if (status.name == STATUS.STRGAME) {
      socket?.emit(ClientGameEvents.PLAYMACH, { matchId: matchId });
    }
  };
  return (
    <>
      <Button onClick={waitingMatch}>StartGame</Button>
    </>
  );
}
