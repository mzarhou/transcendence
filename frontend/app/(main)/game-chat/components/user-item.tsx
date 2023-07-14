"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User } from "@transcendence/common";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

type UserItemProps = {
  user: User;
  children?: ReactNode;
};
export default function UserItem({ user, children }: UserItemProps) {
  return (
    <div className="relative flex justify-between">
      <div className="flex flex-grow space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
          <Image
            src={user.avatar}
            width={72}
            height={72}
            alt=""
            className="rounded-full"
          />
        </div>
        <div className="mt-0.5">
          <p>{user.name}</p>
          {/* TODO: update with real data */}
          <p className="text-sm text-chat-foreground/60">In game</p>
          <p className="text-sm text-chat-foreground/60">#55</p>
        </div>
        <div className="absolute bottom-0 right-2">{children}</div>
      </div>
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="h-6 w-6 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
              Play
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
              Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
