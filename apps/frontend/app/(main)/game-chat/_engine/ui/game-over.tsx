import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { EventGame } from "../entity/entity";
import { useNavigate } from "react-router";

export function GameOver() {
  const socket = useSocket();
  const navigate = useNavigate();

  const retryAction = () => {
    socket?.emit(EventGame.JNRNDMCH);
    // Todo: emit event from server
    navigate("/waiting");
  };
  const homeAction = () => {
    navigate("/");
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
