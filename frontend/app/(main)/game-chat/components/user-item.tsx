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
import { useBlockUser } from "@/api-hooks/use-block-user";

type UserItemProps = {
  user: User;
  children?: ReactNode;
  menuItems?: ReactNode;
  isBlocked?: boolean;
};
export default function UserItem({
  user,
  children,
  menuItems,
  isBlocked,
}: UserItemProps) {
  isBlocked ??= false;

  return (
    <div className="relative flex justify-between">
      <div className="flex flex-grow space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
          <img
            src={user.avatar}
            alt=""
            className="h-[72px] min-h-[72px] w-[72px] min-w-[72px] rounded-full"
          />
        </div>
        <div className="mt-0.5">
          <p>{user.name}</p>
          {/* TODO: update with real data */}
          <p className="text-chat-foreground/60 text-sm">In game</p>
          <p className="text-chat-foreground/60 text-sm">#55</p>
        </div>
        <div className="absolute bottom-0 right-2">{children}</div>
      </div>
      {!isBlocked && (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="h-6 w-6 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                Play
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <BlockUserMenuItem userId={user.id} />
              {menuItems}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export function BlockUserMenuItem({ userId }: { userId: number }) {
  const { trigger: blockeUser } = useBlockUser(userId);

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={blockeUser}>
      Block
    </DropdownMenuItem>
  );
}
