"use client";

import Image from "next/image";
import ababouel from "/public/images/ababouel.jpeg";
import mzarhou from "/public/images/mzarhou.jpeg";
import fechcha from "/public/images/fech-cha.jpeg";
import sismaili from "/public/images/sismaili.jpeg";
import github from "/public/images/github.png";
import linkedin from "/public/images/linkedin.png";
import twitter from "/public/images/twitter.png";
import { NavBar } from "@/components/navbar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Guest from "../Guest";
import GameHomeLottie from "lotties/game-home-lottie.json";
import Lottie from "react-lottie";

export default function Home() {
  const team = [
    {
      image: ababouel,
      userName: "ababouel",
    },
    {
      image: fechcha,
      userName: "fechcha",
    },
    {
      image: mzarhou,
      userName: "mzarhou",
    },
    {
      image: sismaili,
      userName: "sismaili",
    },
  ];

  return (
    <Guest>
      <div className="px-5 md:px-8 ">
        <NavBar />
      </div>
      <main className="container mx-auto px-6 pb-24">
        <div className="flex flex-col items-center  justify-between space-y-8 lg:flex-row ">
          <div className="space-y-8 text-center text-foreground lg:inline-block lg:w-[43%] lg:text-left">
            <h1 className="text-[clamp(2rem,4vw,4rem)] font-semibold leading-tight">
              Welcome to PingPong!
            </h1>
            <p className="font-inter text-lg opacity-70 lg:text-xl">
              Serve, rally, chat, and conquer in our dynamic online pingpong
              game. Play against friends and foes worldwide. Instant fun awaits!
            </p>
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Get Started
            </Link>
          </div>
          <Lottie
            style={{
              padding: 0,
              width: "60%",
            }}
            options={{
              animationData: GameHomeLottie,
              loop: true,
              autoplay: true,
            }}
          />
        </div>
        <div className="mt-56">
          <h1 className="font-jockey text-center text-4xl font-semibold text-foreground md:text-6xl">
            TEAM
          </h1>
          <div className="gap2 mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-8 px-6 xl:gap-10">
            {team.map((user) => (
              <div
                key={user.userName}
                className="mx-auto h-96 w-56 cursor-pointer rounded-lg bg-card pt-10 shadow-lg hover:drop-shadow-lp-cards"
              >
                <Image
                  src={user.image}
                  alt="ababouel pic"
                  width="95"
                  height="95"
                  className="mx-auto rounded-full"
                />
                <h2 className="font-inter mt-5 text-center text-xl text-foreground">
                  {user.userName}
                </h2>
                <div className="flex">
                  <Image
                    src={github}
                    alt="github logo"
                    width="44"
                    height="44"
                    className="ml-6 mt-20"
                  />
                  <Image
                    src={linkedin}
                    alt="linkedin logo"
                    width="44"
                    height="44"
                    className="ml-6 mt-20"
                  />
                  <Image
                    src={twitter}
                    alt="twitter logo"
                    width="44"
                    height="44"
                    className="ml-6 mt-20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Guest>
  );
}
