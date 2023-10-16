import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapsCard from "../_engine/components/maps-card";
import ViewCard from "../_engine/components/view-card";
import BotCard from "../_engine/components/bot-card";

export default function GameSettings() {
  return (
    <>
      <Button className="absolute left-10 mt-5 bg-transparent">
        <ChevronLeft />
      </Button>
      <div className="pt-20 xl:w-full">
        <MapsCard />
        <ViewCard />
        <BotCard />
      </div>
    </>
  );
}
