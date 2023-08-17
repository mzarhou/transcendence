"use client";

import { useUser } from "@/context/user-context";
import axios from "axios";
import { Loader2, LucideChevronDown, Mail } from "lucide-react";
import Link from "next/link";
import { useSWRConfig } from "swr";
import Auth from "./Auth";
import Guest from "./Guest";
import { Button, buttonVariants } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import NotificationsPopup from "./notifications-popup";
import { NoticationsBadge } from "./ui/notifications-badge";
import { useUnreadMessages } from "@/api-hooks/use-unread-messages";

export function NavBar() {
  return (
    <div className="min-h-header max-w-container mx-auto flex items-center justify-between py-2">
      <div>
        <Link href="/game-chat">
          <img src="/logo.png" className="h-20" />
        </Link>
      </div>
      <div className="flex items-center">
        <Auth>
          <MessagesIcon />
          <NotificationsPopup />
        </Auth>
        <ModeToggle className="mx-1" />
        <Auth>
          <NavUserPopup />
        </Auth>
        <Guest
          Loader={
            <div className="flex w-16 items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <Link
            href="/login"
            className={buttonVariants({
              variant: "default",
            })}
          >
            Login
          </Link>
        </Guest>
      </div>
    </div>
  );
}

function MessagesIcon() {
  const { data } = useUnreadMessages();
  return (
    <Button variant="link" className="relative">
      <Mail />
      <NoticationsBadge count={data.length} />
    </Button>
  );
}

function NavUserPopup() {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const closePoppup = () => setOpen(false);

  const logout = async () => {
    await axios.post("/api/auth/logout");
    closePoppup();
    router.replace("/login");
    mutate("/users/me");
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button variant="link" className="flex">
          <span
            className="inline-block overflow-hidden rounded-full"
            style={{
              minWidth: "24px",
              minHeight: "24px",
              height: "24px",
              width: "24px",
            }}
          >
            <div
              className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${user?.avatar}")` }}
            ></div>
          </span>
          <div className="icon-container icon-md ml-2">
            <LucideChevronDown className="h-full w-full" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="mr-3 max-w-xs rounded-xl p-4">
        <Link href="/profile/general" onClick={closePoppup}>
          <div className="mt-8 flex flex-col items-center justify-center">
            <img src={user?.avatar} className="h-20 w-20 rounded-full" />
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
