import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { ClientGameEvents } from "@transcendence/db";
import { useNavigate } from "react-router";
import Image from "next/image";
import winner from "/public/images/sismaili.jpeg";
import crown from "/public/images/crown.png";

export function GameOver() {
  const socket = useSocket();
  const navigate = useNavigate();

  const retryAction = () => {
    socket?.emit(ClientGameEvents.JNRNDMCH);
    // Todo: emit event from server
    navigate("/waiting");
  };
  const homeAction = () => {
    navigate("/");
  };
  return (
    <>
      <div>
        <div className="mt-6 flex flex-col items-center">
          <Image
            src={crown}
            alt="Crown"
            className=" h-[5%] w-[20%] rounded-full"
          />
          <Image
            src={winner}
            alt="Winner"
            className="h-[20%] w-[35%] rounded-full"
          />
          <h1 className="font-boogaloo text-2xl text-[#F4E450] sm:text-8xl">
            WINNER
          </h1>
          <h2 className=" pt-10 font-boogaloo text-xl sm:text-4xl">
            Player1 7 : 3 Player2
          </h2>
        </div>
        <div className=" space-x-5 pt-10">
          <Button className="my-1 h-9 border-2 border-border bg-transparent text-lg xl:h-[106px] xl:w-[220px] xl:text-2xl">
            PLAY AGAIN
          </Button>
          <Button className="my-1 h-9 border-2 border-border bg-transparent text-lg xl:h-[106px] xl:w-[220px] xl:text-2xl">
            RETURN
          </Button>
        </div>
      </div>
    </>
  );
}
