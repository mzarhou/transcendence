"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import pong from "/public/images/pong.gif";
import lightPong from "public/images/light-pong.gif";
import profile_dark from "public/images/profile-dark.png";
import settings_dark from "public/images/settings-dark.png";
import profile from "public/images/profile.png";
import settings from "public/images/settings.png";
import back from "public/images/back.png";
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
            <Button className="absolute left-20 mt-5 bg-transparent">
              <Image src={back} alt="back button" />
            </Button>
            <div className="mt-32 flex flex-col xl:flex-row xl:h-[194px] xl:w-[717px] h-[800px] w-[300px] xl:items-center justify-center gap-11 rounded-md bg-card">
              <div className="text-center text-foreground">
                <h2 className="text-xl">Matches played</h2>
                <p className="text-6xl">20</p>
              </div>
              <div className="text-center text-foreground">
                <h2 className="text-xl">Wins</h2>
                <p className="text-6xl">10</p>
              </div>
              <div className="text-center text-foreground">
                <h2 className="text-xl">Loses</h2>
                <p className="text-6xl">10</p>
              </div>
              <div className="text-center text-foreground">
                <h2 className="text-xl">Points</h2>
                <p className="text-6xl">150</p>
              </div>
              <div className="text-center text-foreground">
                <h2 className="text-6xl">Rank</h2>
                <p className="text-8xl">11</p>
              </div>
            </div>
            {/* <Image
              src={theme === "dark" ? pong : lightPong}
              alt="pong gif"
              className="mx-auto mt-32 h-[50%] w-[60%] lg:block"
            />
            <div className="mr-10 mt-10 flex flex-col">
              <Button className="group w-[80px] h-[80px] flex flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
                <Image src={theme === "dark" ? profile_dark : profile} alt="profile-dark button" title="profile-dark" width='40' height='40' />
                <span className="group invisible text-md text-foreground group-hover:visible">
                  Profile
                </span>
              </Button>
              <Button className="mt-2 group w-[80px] h-[80px] flex flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
                <Image src={theme === "dark" ? settings_dark : settings} alt="settings-dark button" title="settings-dark" width='40' height='40' className="mt-4"/>
                <span className="group invisible group-hover:visible text-md text-foreground mb-5">Game<br />Settings</span>
              </Button>
            </div>
            <div className="fixed top-[65%] xl:top-3/4 flex flex-col gap-8 xl:flex-row xl:gap-10">
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Play offline
              </Button>
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Vs friend
              </Button>
              <Button className="h-[106px] w-[220px] border-2 border-border bg-transparent text-2xl">
                Ranked
              </Button>
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
