import { ChevronLeft } from "lucide-react";
import MapsCard from "./components/maps-card";
import ViewCard from "./components/view-card";
import { Button } from "@/components/ui/button";
import BotCard from "./components/bot-card";
import { Link } from "react-router-dom";

export default function GameSettings() {
  return (
    <>
      <Link to="/" replace={true}>
        <Button className="absolute left-8 top-0 mt-5 border border-border bg-transparent">
          <ChevronLeft />
        </Button>
      </Link>
      <div className="pb-8 pt-20 xl:w-full">
        <MapsCard />
        <ViewCard />
        <BotCard />
      </div>
    </>
  );
}
