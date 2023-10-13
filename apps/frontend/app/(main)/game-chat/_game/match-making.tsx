import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Vs from "/public/images/vs.png";
import player1 from "/public/images/sismaili.jpeg";
import player2 from "public/images/mzarhou.jpeg";

export default function MatchMaking() {
  return (
    <>
      <Button className="absolute left-10 mt-5 bg-transparent">
        <X />
      </Button>
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
    </>
  );
}
