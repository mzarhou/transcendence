"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import GameRouter from "./_game";

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
      <div className="flex h-full w-full flex-col rounded-md bg-card/60 text-card-foreground dark:bg-card/30 md:shadow-sm">
        {children}
      </div>
    </>
  );

  return (
    <div className="h-full space-y-10">
      <Dialog
        open={open}
        onOpenChange={(open) => {
          console.log("open popup...");
          setOpen(open);
        }}
      >
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
      <div className="h-full space-x-4 md:flex">
        <div className="h-[calc(100vh-220px)] flex-grow overflow-y-auto rounded-md border border-border/40 bg-card/60 text-card-foreground/40 dark:bg-card/30 md:h-[calc(100vh-160px)]">
          <GameRouter />
        </div>
        <div className="relative hidden h-full w-full overflow-y-hidden rounded-md border border-border/40 md:block md:min-w-[300px] md:max-w-md">
          {chatPopup}
        </div>
      </div>
    </div>
  );
}
