"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User } from "@transcendence/db";
import { MoreVertical } from "lucide-react";
import { ReactNode } from "react";
import { useBlockUser } from "@/api-hooks/use-block-user";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsFriendInGame } from "@/stores/in-game-users-atom";
import UserRankImage from "@/components/user-rank-image";

type UserItemProps = {
  user: User;
  children?: ReactNode;
  menuItems?: ReactNode;
  isBlocked?: boolean;
  showProfile?: boolean;
};
export default function UserItem({
  user,
  children,
  menuItems,
  isBlocked,
}: UserItemProps) {
  isBlocked ??= false;

  const inGame = useIsFriendInGame(user.id);
  const router = useRouter();

  const goToUserProfile = () => {
    router.push(`/game-chat/profile/${user.id}`);
  };

  return (
    <div className="relative flex justify-between">
      <div className="flex flex-grow space-x-4">
        <div
          onClick={goToUserProfile}
          className={cn(
            "relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg",
            {
              "cursor-pointer": !isBlocked,
            }
          )}
        >
          <div className="h-[72px] w-[72px]">
            <UserRankImage user={user} />
          </div>
        </div>
        <div
          onClick={goToUserProfile}
          className={cn("mt-0.5", { "cursor-pointer": !isBlocked })}
        >
          <p>{user.name}</p>
          <p className="text-sm text-chat-card-foreground/60">{inGame}</p>
          <p className="text-sm text-chat-card-foreground/60">#{user.rank}</p>
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
