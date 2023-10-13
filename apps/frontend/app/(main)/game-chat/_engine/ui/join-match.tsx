import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/events-socket-context";
import { Link, useNavigate } from "react-router-dom";
import { EventGame } from "../entity/entity";
import { Replace } from "lucide-react";

export function JoinMatch() {
  const socket = useSocket();
  // const navigate = useNavigate();
  const joinMatch = () => {
    socket?.emit(EventGame.JNRNDMCH);
  };

  return (
    <div>
      <Link to={"/waiting"}>JoinMatch</Link>
      {/* <Button onClick={() => joinMatch()}>JoinMatch</Button> */}
    </div>
  );
}
