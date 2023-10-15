"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import Game from "./_game";
import Profile from "./_game/profile";
import GameSettings from "./_game/game-settings";
import MatchMaking from "./_game/match-making";

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
    <div className="h-full space-y-10">
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <MessagesSquare />
          </Button>
        </DialogTrigger>
        <DialogContent className="mt-2 h-[98vh] w-[96vw] overflow-hidden rounded-md border-0 border-transparent bg-card p-4">
          <div className="h-full overflow-y-hidden pt-2 md:pt-0">
            {chatPopup}
          </div>
        </DialogContent>
      </Dialog>
      <div className="h-full flex-grow space-x-4 md:flex">
        <div className="flex h-full flex-grow justify-center overflow-y-auto rounded-md border px-[clamp(2rem,7vw,120px)] ">
          {/* <Game /> */}
          <Profile />
          {/* <GameSettings /> */}
          {/* <MatchMaking /> */}
        </div>
        <div className="relative hidden h-full w-full overflow-y-hidden md:block md:max-w-sm">
          {chatPopup}
        </div>
      </div>
    </div>
  );
}
