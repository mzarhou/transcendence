"use client";

import { useUnfriend } from "@/api-hooks/use-unfriend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsFriendConnected } from "@/stores/connected-users-atom";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User } from "@transcendence/db";
import { MoreVertical } from "lucide-react";
import { BlockUserMenuItem } from "./user-item";
import { useFriendUreadMessagesCount } from "@/api-hooks/use-unread-messages";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useIsFriendInGame } from "@/stores/in-game-users-atom";
import { useCreateGameInvitation } from "@/api-hooks/game/use-create-game-invitation";

type FriendItemProps = {
  friend: User;
  className?: string;
  size?: "default" | "sm";
};
export default function FriendItem({
  friend,
  className,
  size,
}: FriendItemProps) {
  size ??= "default";

  const inGame = useIsFriendInGame(friend.id);
  const isConnected = useIsFriendConnected(friend.id);
  const unreadMessagesCount = useFriendUreadMessagesCount(friend.id);
  const { trigger: sendGameInvitation } = useCreateGameInvitation();

  return (
    <div className={cn("relative flex justify-between", className)}>
      <Link href={`/game-chat/${friend.id}`}>
        <div className="flex space-x-4">
          <div
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-full bg-gray-100/10 text-lg",
              size === "default" ? "h-[72px]" : "h-[40px]"
            )}
          >
            <img
              src={friend.avatar}
              width={size === "default" ? 72 : 40}
              height={size === "default" ? 72 : 40}
              alt=""
              className="rounded-full"
            />
            {isConnected && (
              <div
                className={cn(
                  "absolute  bottom-1.5 right-0.5 h-4 w-4 rounded-full border-2 border-card bg-green-400",
                  {
                    "bottom-0 right-0 h-3 w-3": size === "sm",
                    "": size === "sm",
                  }
                )}
              ></div>
            )}
          </div>
          <div
            className={cn("mt-0.5", {
              "flex flex-col justify-center text-lg": size === "sm",
            })}
          >
            <p>{friend.name}</p>
            {size === "default" && (
              <>
                {inGame && (
                  <p className="text-sm text-chat-card-foreground/60">
                    In game
                  </p>
                )}
                <p className="text-sm text-chat-card-foreground/60">
                  #{friend.rank}
                </p>
              </>
            )}
          </div>
        </div>
      </Link>
      <div className={cn(size === "sm" && "flex flex-col justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical
              className={cn("h-6 w-6 cursor-pointer", {
                "h-5 w-5": size === "sm",
              })}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                try {
                  sendGameInvitation({ friendId: friend.id });
                } catch (error) {}
              }}
            >
              Play
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <BlockUserMenuItem userId={friend.id} />
            <UnfriendDropdownMenuItem friendId={friend.id} />
          </DropdownMenuContent>
        </DropdownMenu>
        {unreadMessagesCount > 0 && (
          <div className="absolute right-6 top-0 flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
            {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
}

type FriendIdProp = {
  friendId: number;
};
export function UnfriendDropdownMenuItem({ friendId }: FriendIdProp) {
  const { trigger: unfriend } = useUnfriend({
    targetUserId: friendId,
  });
  return (
    <DropdownMenuItem className="cursor-pointer" onClick={unfriend}>
      Unfriend
    </DropdownMenuItem>
  );
}
