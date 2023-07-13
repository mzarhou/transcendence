"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

type FriendItemProps = {
  id: number;
  showOnlineStatus?: boolean;
};
export default function FriendItem({ id, showOnlineStatus }: FriendItemProps) {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-200 text-lg">
          <span className="text-gray-500">{id}</span>
          {showOnlineStatus && (
            <div className="absolute bottom-1.5 right-0.5 h-4 w-4 rounded-full border-2 border-chat bg-green-400"></div>
          )}
        </div>
        <div className="mt-0.5">
          <p>Farouk Ech</p>
          <p className="text-sm text-chat-foreground/60">In game</p>
          <p className="text-sm text-chat-foreground/60">#60</p>
        </div>
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
            <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
              Unfriend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
