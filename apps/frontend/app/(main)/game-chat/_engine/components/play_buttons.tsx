import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/socket-provider";
import { useNavigate } from "react-router-dom";
import { EventGame } from "../entity/entity";

export default function PlayButtons() {
  const socket = useSocket();
  const navigate = useNavigate();
  const joinMatch = () => {
    socket?.emit(EventGame.JNRNDMCH);
    // TODO: emit waiting event from server
    navigate("/waiting");
  };

  return (
    <>
      <div className="fixed top-[77%] flex flex-col gap-1 xl:top-3/4 xl:flex-row xl:gap-10">
        <Button
          onClick={joinMatch}
          className="my-1 h-9 border-2 border-border bg-transparent text-lg xl:h-[106px] xl:w-[220px] xl:text-2xl"
        >
          Vs friend
        </Button>
        <Button className="my-1 h-9 border-2 border-border bg-transparent text-lg xl:h-[106px] xl:w-[220px] xl:text-2xl">
          Ranked
        </Button>
      </div>
    </>
  );
}
