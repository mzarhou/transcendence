"use client";

import { usePostFriendRequest } from "@/api-hooks/friend-requests/use-post-friend-request";
import { LoaderButton } from "@/components/ui/loader-button";
import { SearchUser } from "@transcendence/common";
import { Plus, X } from "lucide-react";
import {
  AcceptFriendRequestBtn,
  RefuseFriendRequestBtn,
} from "./friend-request-item";
import { useDeleteFriendRequest } from "@/api-hooks/friend-requests/use-delete-friend-request";
import { UnfriendDropdownMenuItem } from "./friend-item";
import UserItem from "./user-item";

type SearchFriendItemProps = {
  user: SearchUser;
};
export default function SearchFriendItem({ user }: SearchFriendItemProps) {
  return (
    <UserItem
      user={user}
      menuItems={
        user.isFriend ? <UnfriendDropdownMenuItem friendId={user.id} /> : <></>
      }
    >
      <SearchFrientItemActions user={user} />
    </UserItem>
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
