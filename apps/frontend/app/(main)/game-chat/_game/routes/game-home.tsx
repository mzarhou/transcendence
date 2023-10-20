"use client";

import Image from "next/image";
import pong from "/public/images/pong.gif";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { ClientGameEvents } from "@transcendence/db";
import { Gamepad2, Settings } from "lucide-react";
import { useNavigate } from "react-router";

export default function Game() {
  const socket = useSocket();
  const navigate = useNavigate();

  const joinMatch = () => socket?.emit(ClientGameEvents.JNRNDMCH);

  return (
    <div className="relative flex h-full flex-col justify-center md:space-y-20">
      <Image
        src={pong}
        alt="pong gif"
        className="mx-auto aspect-square w-[90%] md:w-[60%]"
      />
      <div className="flex flex-col px-8 lg:flex-row lg:justify-center lg:space-x-10">
        <Button
          onClick={joinMatch}
          className="my-1 h-9 space-x-4 border-2 border-border bg-transparent py-8 text-lg md:min-w-[200px]"
        >
          <Gamepad2 />
          <span>Play</span>
        </Button>

        <Button
          onClick={() => navigate("/game-settings", { replace: true })}
          className="my-1 h-9 space-x-4 border-2 border-border bg-transparent py-8 text-lg md:min-w-[200px]"
        >
          <Settings />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
}
