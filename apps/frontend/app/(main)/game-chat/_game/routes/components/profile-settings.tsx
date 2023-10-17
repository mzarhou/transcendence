import Image from "next/image";
import { Button } from "@/components/ui/button";
import profile_dark from "public/images/profile-dark.png";
import settings_dark from "public/images/settings-dark.png";
import profile from "public/images/profile.png";
import settings from "public/images/settings.png";
import { useTheme } from "next-themes";
import { Gamepad2, User2 } from "lucide-react";
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
