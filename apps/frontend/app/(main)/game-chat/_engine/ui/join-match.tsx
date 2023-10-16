import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { useTheme } from "next-themes";
import lightPong from "public/images/light-pong.gif";
import Image from "next/image";
import pong from "/public/images/pong.gif";
import ProfileSettings from "../components/profile-settings";
import PlayButtons from "../components/play_buttons";

export function JoinMatch() {
  const { theme } = useTheme();

  if (!theme) {
    return <></>;
  }

  return (
    <>
      <Image
        src={theme === "dark" || theme === "system" ? pong : lightPong}
        alt="pong gif"
        className="mx-auto h-[50%] w-[50%] lg:block xl:mt-32"
      />
      <ProfileSettings />
      <PlayButtons />
    </>
  );
}
