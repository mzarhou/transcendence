import { ChevronLeft } from "lucide-react";
import MapsCard from "./components/maps-card";
import ViewCard from "./components/view-card";
import { Button } from "@/components/ui/button";
import BotCard from "./components/bot-card";

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
