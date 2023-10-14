import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/events-socket-context";
import { Link, useNavigate } from "react-router-dom";
import { EventGame } from "../entity/entity";

export function JoinMatch() {
  const socket = useSocket();
  const navigate = useNavigate();
  const joinMatch = () => {
    socket?.emit(EventGame.JNRNDMCH);
    navigate("/waiting");
  };

  return (
    <div>
      <Button onClick={() => joinMatch()}>JoinMatch</Button>
    </div>
  );
}
