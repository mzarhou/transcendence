import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Vs from "/public/images/vs.png";
import {
  STATUS,
  useMatchState,
  usePlayer1State,
  usePlayer2State,
  useStatus,
} from "../state";
import { ClientGameEvents } from "@transcendence/db";
import { useSocket, useUser } from "@/context";
import { useCancelGame } from "@/api-hooks/game/user-cancel-game";
import { useGameProfile } from "@/api-hooks/game/use-game-profile";
import UserRankImage from "@/components/user-rank-image";
import Lottie from "react-lottie";
import WaintingAnimationData from "lotties/waiting-match.json";

export default function MatchMaking() {
  const socket = useSocket();
  const { matchId } = useMatchState();
  const status = useStatus();
  const p1 = usePlayer1State();
  const p2 = usePlayer2State();
  const { user } = useUser();

  const { data: user1Profile } = useGameProfile(p1.id);
  const { data: user2Profile } = useGameProfile(p2.id);
  const { trigger: cancel } = useCancelGame(matchId);

  const startGame = () => {
    if (status.name == STATUS.STRGAME) {
      socket?.emit(ClientGameEvents.PLAYMACH, { matchId: matchId });
    }
  };

  const cancelGame = async () => {
    try {
      await cancel();
    } catch (error) {}
  };

  return (
    <>
      <Button
        className="absolute left-10 mt-5 bg-transparent"
        onClick={cancelGame}
      >
        <X />
      </Button>
      <div className="mt-40 flex px-4">
        {
          <UserRankImage
            user={user1Profile ?? user}
            className="h-[40%] w-[30%] rounded-full"
          />
        }
        <Image src={Vs} alt="Vs" className="-mt-4 h-[50%] w-[50%]" />
        {user2Profile ? (
          <UserRankImage
            user={user2Profile ?? user}
            className="h-[40%] w-[30%] rounded-full"
          />
        ) : (
          <div className="h-[40%] w-[30%] rounded-full bg-white/5">
            <Lottie
              options={{
                animationData: WaintingAnimationData,
                loop: true,
                autoplay: true,
              }}
            />
          </div>
        )}
      </div>
      <Button onClick={startGame} className="mx-auto mt-4 block">
        Start Game
      </Button>
    </>
  );
}
