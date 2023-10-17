import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Vs from "/public/images/vs.png";
import player1 from "/public/images/sismaili.jpeg";
import player2 from "public/images/mzarhou.jpeg";
import { useNavigate } from "react-router";
import {
  useBallState,
  useMatchState,
  usePlayer1State,
  usePlayer2State,
  useScoreState,
} from "../state";
import { useSocket } from "@/context";
import { ClientGameEvents } from "@transcendence/db";

export default function MatchMaking() {
  const navigate = useNavigate();

  const socket = useSocket();
  const { matchId, homeId, adversaryId } = useMatchState();
  const p1 = usePlayer1State();
  const p2 = usePlayer2State();
  const ball = useBallState();
  const scores = useScoreState();

  const startGame = () => {
    p1.reset();
    p2.reset();
    ball.reset();
    scores.reset();
    if (matchId > 0 && homeId != undefined && adversaryId != undefined)
      socket?.emit(ClientGameEvents.PLAYMACH, { matchId: matchId });
  };

  const cancelGame = () => {
    // TODO: cancel game
    navigate("/", { replace: true });
  };

  return (
    <>
      <Button
        className="absolute left-10 mt-5 bg-transparent"
        onClick={cancelGame}
      >
        <X />
      </Button>
      <div className="flex px-4">
        <Image
          src={player1}
          alt="player 1"
          className="mt-40 h-[40%] w-[30%] rounded-full"
        />
        <Image src={Vs} alt="Vs" className="mt-36 h-[50%] w-[50%]" />
        <Image
          src={player2}
          alt="player 2"
          className="mt-40 h-[40%] w-[30%] rounded-full"
        />
      </div>
      <Button onClick={startGame} className="mx-auto mt-4 block">
        Start Game
      </Button>
    </>
  );
}
