"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode } from "react";
import Game from "./_game/index";
import Profile from "./_game/profile";
import GameSettings from "./_game/game-settings";
import { useState, useEffect } from "react";

type Props = {
  children: ReactNode;
};
export default function GameLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hideDialog = () => {
      const width = document.body.clientWidth;
      if (width > 768 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", hideDialog);
    return () => window.removeEventListener("resize", hideDialog);
  }, [open]);

  const chatPopup = (
    <>
      <div className="flex h-full w-full flex-col rounded-md bg-card text-card-foreground md:shadow-sm">
        {children}
      </div>
    </>
  );

  return (
    <>
      <div className="h-full space-y-10">
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <MessagesSquare />
            </Button>
          </DialogTrigger>
          <DialogContent className="mt-2 h-[98vh] w-[96vw] overflow-hidden rounded-md border-0 border-transparent">
            <div className="h-full overflow-y-hidden">{chatPopup}</div>
          </DialogContent>
        </Dialog>
        <div className="h-full flex-grow space-x-4 md:flex">
          <div className="flex h-full flex-grow justify-center overflow-y-auto rounded-md border px-[clamp(2rem,7vw,120px)] ">
            <Game />
            {/* <Profile /> */}
            {/* <GameSettings /> */}
          </div>
          <div className="relative hidden h-full w-full overflow-y-hidden md:block md:max-w-sm">
            {chatPopup}
          </div>
        </div>
      </div>
    </>
  );
}
