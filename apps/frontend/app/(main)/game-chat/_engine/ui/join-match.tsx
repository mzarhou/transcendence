import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/events-socket-context";
import { useNavigate } from "react-router-dom";
import { EventGame } from "../entity/entity";

export function JoinMatch() {
  const socket = useSocket();
  const navigate = useNavigate();
  const joinMatch = () => {
    socket?.emit(EventGame.JNRNDMCH);
    navigate("/waiting");
  };

  return (
    <>
      <Button onClick={() => joinMatch()}>JoinMatchddd</Button>
    </>
  );
}
