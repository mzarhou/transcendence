import { useMatchFoundEvent } from "../utils/websocket-events";
import { useSocket } from "@/context/events-socket-context";
import { EventGame } from "../entity/entity";
import { useNavigate } from "react-router";
import { STATUS, useMatchState, useStatus } from "../state";
import { Button } from "@/components/ui/button";

export function WaitingMatch() {
  const socket = useSocket();
  const { matchId } = useMatchState();
  const navigate = useNavigate();
  const status = useStatus();

  useMatchFoundEvent();
  const waitingMatch = () => {
    if (status.name == STATUS.STRGAME) {
      socket?.emit(EventGame.PLAYMACH, { matchId: matchId });
      navigate("/playing");
    }
  };
  return (
    <>
      <Button onClick={() => waitingMatch}>StartGame</Button>
    </>
  );
}
