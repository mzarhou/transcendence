"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import pong from "/public/images/pong.gif";
import lightPong from "public/images/light-pong.gif";
import profile from "public/images/profile.png";
import settings from "public/images/settings.png";
import FakeChatSearch from "./components/fake-chat-search";

type Props = {
  children: ReactNode;
};
export default function GameLayout({ children }: Props) {
  const chatPopup = (
    <>
      <div className="flex h-full w-full flex-col rounded-md bg-card text-card-foreground md:shadow-sm">
        {children}
      </div>
    </>
  );
  const { theme } = useTheme();
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
          <div className="flex h-full flex-grow justify-center rounded-md border">
            <Image
              src={theme === "dark" ? pong : lightPong}
              alt="pong gif"
              className="mx-auto mt-32 h-[50%] w-[60%] lg:block"
            />
            <div className="mr-10 mt-10 flex flex-col">
              <Button className="group w-[80px] h-[80px] flex flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
                <Image src={profile} alt="profile button" title="profile" width='40' height='40' />
                <span className="group invisible text-md text-foreground group-hover:visible">
                  Profile
                </span>
              </Button>
              <Button className="mt-2 group w-[80px] h-[80px] flex flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
                <Image src={settings} alt="profile button" title="settings" width='40' height='40' className="mt-4"/>
                <span className="group invisible group-hover:visible text-md text-foreground mb-5">Game<br />Settings</span>
              </Button>
            </div>
            <div className="absolute bottom-10 flex flex-col gap-8 xl:bottom-40 xl:flex-row xl:gap-10">
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Play offline
              </Button>
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Vs friend
              </Button>
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Ranked
              </Button>
            </div>
            {/* <div className="flex flex-col items-center space-y-4">
            <div>Game</div>
            <Button>Default</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="outline">outline</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="link">link</Button>
            <Button variant="ghost">ghost</Button>
          </div> */}
          </div>
          <div className="relative hidden h-full w-full overflow-y-hidden md:block md:max-w-sm">
            {chatPopup}
          </div>
        </div>
      </div>
    </>
  );
}
