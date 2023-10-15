import { Button } from "@/components/ui/button";
import { useGameOver } from "../utils/websocket-events";
import { useSocket } from "@/context";
import { EventGame } from "../entity/entity";
import { useNavigate } from "react-router";

export function GameOver() {
  const socket = useSocket();
  const navigate = useNavigate();
  useGameOver();
  const retryAction = () => {
    if (socket) {
      socket.emit(EventGame.JNRNDMCH);
      navigate("/waiting");
    }
  };
  const homeAction = () => {
    if (socket) {
      navigate("/");
    }
  };
  return (
    <>
      <Button color={"green"} onClick={retryAction}>
        Retry
      </Button>
      <Button color={"red"} onClick={homeAction}>
        Return
      </Button>
    </>
  );
}
