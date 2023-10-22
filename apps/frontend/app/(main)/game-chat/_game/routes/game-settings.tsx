import { ChevronLeft } from "lucide-react";
import MapsCard from "./components/MapsCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function GameSettings() {
  return (
    <>
      <Link to="/" replace={true}>
        <Button className="absolute left-8 top-0 mt-5 border border-border bg-transparent text-foreground hover:text-white">
          <ChevronLeft />
        </Button>
      </Link>
      <div className="pb-8 pt-20 xl:w-full">
        <MapsCard />
      </div>
    </>
  );
}
