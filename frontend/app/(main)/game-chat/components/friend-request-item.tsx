"use client";

import { FriendRequest } from "@transcendence/common";
import UserItem from "./user-item";
import { LoaderButton } from "@/components/ui/loader-button";
import { Check, X } from "lucide-react";
import { useAcceptFriendRequest } from "@/api-hooks/user-accept-friend-request";
import { useDeleteFriendRequest } from "@/api-hooks/use-delete-friend-request";

type FriendRequestItemProps = {
  friendRequest: FriendRequest;
};
export function FriendRequestItem({ friendRequest }: FriendRequestItemProps) {
  return (
    <div>
      <UserItem user={friendRequest.requester!}>
        <AcceptFriendRequestBtn friendRequestId={friendRequest.id} />
        <RefuseFriendRequestBtn friendRequestId={friendRequest.id} />
      </UserItem>
    </div>
  );
}

type AcceptFriendRequestBtnProps = {
  friendRequestId: number;
};
export function AcceptFriendRequestBtn({
  friendRequestId,
}: AcceptFriendRequestBtnProps) {
  const { trigger, isMutating } = useAcceptFriendRequest(friendRequestId);
  return (
    <LoaderButton
      title="accept"
      variant="ghost"
      className="h-8"
      isLoading={isMutating}
      onClick={trigger}
    >
      <Check />
    </LoaderButton>
  );
}

type RefuseFriendRequestBtnProps = {
  friendRequestId: number;
};
export function RefuseFriendRequestBtn({
  friendRequestId,
}: RefuseFriendRequestBtnProps) {
  const { trigger, isMutating } = useDeleteFriendRequest(friendRequestId);

  return (
    <LoaderButton
      title="refuse"
      variant="ghost"
      className="h-8"
      isLoading={isMutating}
      onClick={trigger}
    >
      <X />
    </LoaderButton>
  );
}
