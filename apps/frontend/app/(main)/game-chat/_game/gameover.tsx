import Image from "next/image";
import winner from "/public/images/sismaili.jpeg";
import crown from "/public/images/crown.png";
import { Button } from "@/components/ui/button";

export default function GameOver() {
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
          <h2 className=" font-boogaloo pt-10 text-xl sm:text-4xl">
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
