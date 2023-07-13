"use client";

import { usePostFriendRequest } from "@/api-hooks/use-post-friend-request";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderButton } from "@/components/ui/loader-button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { SearchUser } from "@transcendence/common";
import { MoreVertical } from "lucide-react";

type SearchFriendItemProps = {
  user: SearchUser;
};
export default function SearchFriendItem({ user }: SearchFriendItemProps) {
  return (
    <div className="relative flex justify-between">
      <div className="flex flex-grow space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-200 text-lg">
          <span className="text-gray-500">{user.id}</span>
        </div>
        <div className="mt-0.5">
          <p>{user.name}</p>
          {/* TODO: update with real data */}
          <p className="text-sm text-chat-foreground/60">In game</p>
          <p className="text-sm text-chat-foreground/60">#55</p>
        </div>
        {!user.isFriend && (
          <div className="absolute bottom-0 right-2">
            <AddFriendBtn user={user} />
          </div>
        )}
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

function AddFriendBtn({ user }: SearchFriendItemProps) {
  const { isMutating, trigger } = usePostFriendRequest();

  return (
    <LoaderButton
      size="sm"
      className="h-8 w-24"
      isLoading={isMutating}
      onClick={() => {
        trigger({
          targetUserId: user.id,
        });
      }}
    >
      add friend
    </LoaderButton>
  );
}
