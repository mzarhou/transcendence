"use client";

import Image from "next/image";
import landingpageimg from "/public/images/landing-page-image.png";
import darkimg from "public/images/darkimg-lp.png"
import ababouel from "/public/images/ababouel.jpeg";
import mzarhou from "/public/images/mzarhou.jpeg";
import fechcha from "/public/images/fech-cha.jpeg";
import sismaili from "/public/images/sismaili.jpeg";
import github from "/public/images/github.png";
import linkedin from "/public/images/linkedin.png";
import twitter from "/public/images/twitter.png";
import { NavBar } from "@/components/navbar";
import { UserProvider } from "@/context/user-context";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();

  return (
    <UserProvider>
      <div className="px-5 md:px-8 ">
        <NavBar />
      </div>
      <main className="container mx-auto px-6 pb-24 pt-20 lg:pt-40">
        <div className="flex flex-col items-center  justify-between space-y-8 lg:flex-row ">
          <div className="space-y-8 text-center text-foreground lg:inline-block lg:w-[40%] lg:text-left">
            <h1 className="text-[clamp(2rem,4vw,4rem)] font-semibold">
              WELCOME TO FT_TRANSCENDENCE
            </h1>
            <p className="font-inter text-lg lg:text-xl">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
          </div>
          <Image
            src={theme === 'dark' ? darkimg : landingpageimg}
            alt="landing page image"
            className="lg:block"
          />
        </div>
        <div className="mt-56">
          <h1 className="font-jockey text-center text-4xl font-semibold text-foreground md:text-6xl">
            TEAM
          </h1>
          <div className="gap2 mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-8 px-6 xl:gap-10">
            <div className="mx-auto h-96 w-56 rounded-lg bg-card pt-10 hover:drop-shadow-lp-cards">
              <Image
                src={ababouel}
                alt="ababouel pic"
                width="95"
                height="95"
                className="mx-auto rounded-full"
              />
              <h2 className="font-inter mt-5 text-center text-xl text-foreground">
                ababouel
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
            <div className="mx-auto h-96 w-56 rounded-lg bg-card pt-10 hover:drop-shadow-lp-cards">
              <Image
                src={mzarhou}
                alt="mzarhou pic"
                width="95"
                height="95"
                className="mx-auto rounded-full"
              />
              <h2 className="font-inter mt-5 text-center text-xl text-foreground">
                mzarhou
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
            <div className="mx-auto h-96 w-56 rounded-lg bg-card pt-10 hover:drop-shadow-lp-cards">
              <Image
                src={fechcha}
                alt="fechcha pic"
                width="95"
                height="95"
                className="mx-auto rounded-full"
              />
              <h2 className="font-inter mt-5 text-center text-xl text-foreground">
                fech-cha
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
            <div className="mx-auto h-96 w-56 rounded-lg bg-card pt-10 hover:drop-shadow-lp-cards">
              <Image
                src={sismaili}
                alt="sismaili pic"
                width="95"
                height="95"
                className="mx-auto rounded-full"
              />
              <h2 className="font-inter mt-5 text-center text-xl text-foreground">
                sismaili
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
          </div>
        </div>
      </main>
      {/* <div className="mb-24 mt-12 px-5 md:px-8">
        <main className="mx-auto max-w-container"></main>
      </div> */}
    </UserProvider>
  );
}
