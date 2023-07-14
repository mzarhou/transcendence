"use client";

import { usePostFriendRequest } from "@/api-hooks/use-post-friend-request";
import { useAcceptFriendRequest } from "@/api-hooks/user-accept-friend-request";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderButton } from "@/components/ui/loader-button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { SearchUser } from "@transcendence/common";
import { Check, MoreVertical, Plus, X } from "lucide-react";
import Image from "next/image";
import {
  AcceptFriendRequestBtn,
  RefuseFriendRequestBtn,
} from "../../friend-requests/components/friend-request-item";
import { useDeleteFriendRequest } from "@/api-hooks/use-delete-friend-request";
import { UnfriendDropdownMenuItem } from "../../components/friend-item";

type SearchFriendItemProps = {
  user: SearchUser;
};
export default function SearchFriendItem({ user }: SearchFriendItemProps) {
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
        <div className="absolute bottom-0 right-2">
          <SearchFrientItemActions user={user} />
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
            {user.isFriend && <UnfriendDropdownMenuItem friendId={user.id} />}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function SearchFrientItemActions({ user }: SearchFriendItemProps) {
  if (user.isFriend) {
    return <></>;
  } else if (user.receivedFrId) {
    return (
      <>
        <AcceptFriendRequestBtn friendRequestId={user.receivedFrId} />
        <RefuseFriendRequestBtn friendRequestId={user.receivedFrId} />
      </>
    );
  } else if (user.sentFrId) {
    return <CancelFriendRequest friendRequestId={user.sentFrId} />;
  }
  return <AddFriendBtn user={user} />;
}

function AddFriendBtn({ user }: SearchFriendItemProps) {
  const { isMutating, trigger } = usePostFriendRequest();

  return (
    <LoaderButton
      size="sm"
      className="h-8 space-x-0.5 font-semibold"
      isLoading={isMutating}
      onClick={() => {
        trigger({
          targetUserId: user.id,
        });
      }}
    >
      <span>Add</span>
      <Plus className="h-5 w-5" />
    </LoaderButton>
  );
}

function CancelFriendRequest({ friendRequestId }: { friendRequestId: number }) {
  const { trigger, isMutating } = useDeleteFriendRequest(friendRequestId);
  return (
    <LoaderButton
      onClick={trigger}
      isLoading={isMutating}
      title="Cancel"
      variant="ghost"
      className="h-8 px-2"
    >
      <p>Pending</p>
      <X />
    </LoaderButton>
  );
}
