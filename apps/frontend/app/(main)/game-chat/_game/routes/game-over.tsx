import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { ClientGameEvents } from "@transcendence/db";
import { useNavigate } from "react-router";
import Image from "next/image";
import crown from "/public/images/crown.png";
import { useMatchState, useScoreState } from "../state";
import { useGameProfile } from "@/api-hooks/game/use-game-profile";
import { useEffect } from "react";
import UserRankImage from "@/components/user-rank-image";

export function GameOver() {
  const socket = useSocket();
  const navigate = useNavigate();
  const match = useMatchState();
  const scores = useScoreState();
  const { data: winner } = useGameProfile(match.winnerId!);

  useEffect(() => {
    return () => {
      match.reset();
      scores.reset();
    };
  }, []);

  const retryAction = () => {
    socket?.emit(ClientGameEvents.JNRNDMCH);
  };

  const homeAction = () => {
    navigate("/", { replace: true });
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
          {winner && (
            <div className="h-[20%] w-[35%] rounded-full">
              <UserRankImage user={winner} />
            </div>
          )}
          <h1 className="mt-4 font-boogaloo text-2xl text-[#F4E450] sm:text-8xl">
            WINNER
          </h1>
          <h2 className=" pt-10 font-boogaloo text-xl sm:text-4xl">
            {scores.home} : {scores.adversary}
          </h2>
        </div>
        <div className=" flex justify-center space-x-5 pt-10">
          <Button
            onClick={retryAction}
            className="my-1 h-9 border-2 border-border bg-transparent text-lg text-foreground hover:text-white xl:h-[106px] xl:w-[220px] xl:text-2xl"
          >
            PLAY AGAIN
          </Button>
          <Button
            onClick={homeAction}
            className="my-1 h-9 border-2 border-border bg-transparent text-lg text-foreground hover:text-white xl:h-[106px] xl:w-[220px] xl:text-2xl"
          >
            RETURN
          </Button>
        </div>
      </div>
    </>
  );
}
