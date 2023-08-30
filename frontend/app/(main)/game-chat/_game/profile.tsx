import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Profile() {
  return (
    <>
      <Button className="absolute left-10 mt-5 bg-transparent">
        <ChevronLeft />
      </Button>
      <div className="pt-20 xl:w-full">
        <div className="flex flex-wrap justify-center gap-16 rounded-md bg-card px-4 py-12 md:items-center xl:gap-24">
          <RankItems text="Matches played" value={20} />
          <RankItems text="Wins" value={10} />
          <RankItems text="Loses" value={10} />
          <RankItems text="Points" value={150} />
          <div className="text-center text-foreground/95">
            <h2 className="text-6xl">Rank</h2>
            <p className="text-8xl">11</p>
          </div>
        </div>
        <div className="mt-10 flex justify-between space-x-5">
          <h2 className="text-lg xl:text-2xl">Friends</h2>
          <div className="my-auto h-px w-full bg-foreground/20"></div>
        </div>
      </div>
    </>
  );
}

function RankItems(props: { text: string; value: number }) {
  return (
    <>
      <div className="text-foreground/85 text-center">
        <h2 className="text-lg xl:text-2xl">{props.text}</h2>
        <p className="text-2xl xl:text-4xl">{props.value}</p>
      </div>
    </>
  );
}
