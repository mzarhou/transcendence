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
import UserRankImage from "@/components/user-rank-image";

type FriendItemProps = {
  friend: User;
  className?: string;
};
export default function FriendItem({ friend, className }: FriendItemProps) {
  const inGame = useIsFriendInGame(friend.id);
  const isConnected = useIsFriendConnected(friend.id);
  const unreadMessagesCount = useFriendUreadMessagesCount(friend.id);
  const { trigger: sendGameInvitation } = useCreateGameInvitation();

  return (
    <div className={cn("relative flex justify-between", className)}>
      <Link href={`/game-chat/${friend.id}`}>
        <div className="flex space-x-4">
          <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
            <UserRankImage user={friend} rankImageWidth={72} />
            {isConnected && (
              <div className="absolute  bottom-1.5 right-0.5 h-4 w-4 rounded-full border-2 border-card bg-green-400"></div>
            )}
          </div>
          <div className={"mt-0.5"}>
            <p>{friend.name}</p>
            {inGame && (
              <p className="text-sm text-chat-card-foreground/60">In game</p>
            )}
            <p className="text-sm text-chat-card-foreground/60">
              #{friend.rank}
            </p>
          </div>
        </div>
      </Link>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="h-6 w-6 cursor-pointer" />
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
