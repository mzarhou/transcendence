import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { useNavigate } from "react-router-dom";
import { ClientGameEvents } from "@transcendence/db";

export function JoinMatch() {
  const socket = useSocket();
  const navigate = useNavigate();

  const joinMatch = () => {
    socket?.emit(ClientGameEvents.JNRNDMCH);
    // TODO: emit waiting event from server
    navigate("/waiting");
  };

  return (
    <div>
      <Button onClick={() => joinMatch()}>JoinMatch</Button>
    </div>
  );
}
