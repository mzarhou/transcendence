"use client";

import Image from "next/image";
import pong from "/public/images/pong.gif";
import lightPong from "public/images/light-pong.gif";
import { useTheme } from "next-themes";
import ProfileSettings from "./components/profile-settings";
import PlayButtons from "./components/play-buttons";

export default function Game() {
  const { theme } = useTheme();

  if (!theme) {
    return <></>;
  }

  return (
    <div className="relative flex h-full flex-col justify-center md:space-y-20">
      <Image
        src={pong}
        alt="pong gif"
        className="mx-auto aspect-square w-[90%] md:w-[60%]"
      />
      <PlayButtons />
    </div>
  );
}
