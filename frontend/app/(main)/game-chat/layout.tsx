import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode } from "react";
import GoBackBtn from "./components/chat-go-back";

type Props = {
  children: ReactNode;
};
export default function GameLayout({ children }: Props) {
  const chatPopup = (
    <>
      <div className="flex h-full w-full flex-col rounded-md bg-chat text-chat-foreground/70 md:shadow-sm">
        <GoBackBtn className="md:ml-4 md:py-5" />
        {children}
      </div>
    </>
  );

  return (
    <div className="h-full space-y-10">
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <MessagesSquare />
          </Button>
        </DialogTrigger>
        <DialogContent className="mt-2 h-[98vh] w-[96vw] overflow-hidden rounded-md border-0 border-transparent bg-chat">
          <div className="h-full overflow-y-hidden">{chatPopup}</div>
        </DialogContent>
      </Dialog>
      <div className="h-full space-x-4 md:flex">
        <div className="flex h-full flex-grow items-center justify-center rounded-md bg-chat text-3xl font-light text-chat-foreground/40">
          Game
        </div>
        <div className="relative hidden h-full w-full overflow-y-hidden md:block md:max-w-sm">
          {chatPopup}
        </div>
      </div>
    </div>
  );
}
