"use client";

import { useUser } from "@/app/context/user-context";
import axios from "axios";
import { Loader2, LucideChevronDown } from "lucide-react";
import Link from "next/link";
import { useSWRConfig } from "swr";
import Auth from "../Auth";
import Guest from "../Guest";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { login } from "./auth";
import { useRef } from "react";

export function NavBar() {
  return (
    <div className="max-w-container mx-auto min-h-header flex justify-between items-center">
      <div></div>
      <Auth>
        <NavUserPopup />
      </Auth>
      <Guest
        Loader={
          <div className="flex justify-center items-center w-16">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <form action={login}>
          <Button>Login</Button>
        </form>
      </Guest>
    </div>
  );
}

function NavUserPopup() {
  const poppupTriggerRef = useRef<HTMLButtonElement>(null);
  const { user } = useUser();
  const { mutate } = useSWRConfig();

  const closePoppup = () => {
    poppupTriggerRef.current?.click();
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    closePoppup();
    mutate("/users/me");
  };

  return (
    <Popover>
      <PopoverTrigger ref={poppupTriggerRef} asChild>
        <Button variant="link" className="flex">
          <span
            className="inline-block rounded-full overflow-hidden"
            style={{
              minWidth: "24px",
              minHeight: "24px",
              height: "24px",
              width: "24px",
            }}
          >
            <div
              className="w-full h-full rounded-full bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: `url("${user?.avatar}")` }}
            ></div>
          </span>
          <div className="icon-container icon-md ml-2 text-gray-500">
            <LucideChevronDown className="w-full h-full" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="mr-3 p-4 max-w-xs rounded-xl">
        <Link href="/profile/general" onClick={closePoppup}>
          <div className="flex flex-col items-center justify-center mt-8">
            <img src={user?.avatar} className="rounded-full w-20 h-20" />
            <div className="mt-1 font-semibold">{user?.name}</div>
          </div>
        </Link>
        <div className="px-2">
          <hr className="mt-10" />
        </div>
        <div className="mt-2">
          <Button
            variant="link"
            className="hover:no-underline"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
