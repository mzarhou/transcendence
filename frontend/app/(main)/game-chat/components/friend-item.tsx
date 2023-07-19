"use client";

import { useUnfriend } from "@/api-hooks/use-unfriend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsFriendConnected } from "@/stores/connected-users-atom";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User } from "@transcendence/common";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

type FriendItemProps = {
  friend: User;
};
export default function FriendItem({ friend }: FriendItemProps) {
  const isFriendConnected = useIsFriendConnected();

  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
          <Image
            src={friend.avatar}
            width={72}
            height={72}
            alt=""
            className="rounded-full"
          />
          {isFriendConnected(friend.id) && (
            <div className="absolute bottom-1.5 right-0.5 h-4 w-4 rounded-full border-2 border-chat bg-green-400"></div>
          )}
        </div>
        <div className="mt-0.5">
          <p>{friend.name}</p>
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
            <UnfriendDropdownMenuItem friendId={friend.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function UnfriendDropdownMenuItem({ friendId }: { friendId: number }) {
  const { trigger: unfriend } = useUnfriend({
    targetUserId: friendId,
  });
  return (
    <DropdownMenuItem
      className="cursor-pointer hover:bg-chat/90"
      onClick={unfriend}
    >
      Unfriend
    </DropdownMenuItem>
  );
}
