import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileSettings() {
  const { theme } = useTheme();

  if (!theme) {
    return <></>;
  }

  return (
    <div className="absolute right-2 top-2 flex flex-col">
      <Link to="/game-settings">
        <Button className="group flex h-24 w-full flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
          <Gamepad2 className="h-[20px] w-[20px]" />
          <span className="text-md group invisible text-foreground group-hover:visible">
            Game
            <br />
            Settings
          </span>
        </Button>
      </Link>
    </div>
  );
}
