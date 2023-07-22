"use client";

import { Bell } from "lucide-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useNotifications } from "@/api-hooks/use-notifications";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FRIEND_REQUEST_EVENT,
  FRIEND_REQUEST_ACCEPTED_EVENT,
  FriendRequest,
  Notification,
} from "@transcendence/common";
import { useClearAllNotifications } from "@/api-hooks/use-clear-all-notifications";
import { LoaderButton } from "./ui/loader-button";
import { useReadAllNotifications } from "@/api-hooks/use-read-all-notifications";

export default function NotificationsPopup() {
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();

  const notificationsItems =
    notifications.length > 0 ? (
      notifications.map((nt) => (
        <div
          className={cn({
            "bg-chat-card": !nt.isRead,
          })}
        >
          <NotificationItem key={nt.id} notification={nt} setOpen={setOpen} />
        </div>
      ))
    ) : (
      <div className="flex h-24 items-center justify-center opacity-50">
        No notifications Found
      </div>
    );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="link" className="relative">
          <Bell />
          {unreadNotificationsCount > 0 && (
            <div
              className={cn(
                "absolute bottom-1.5 right-0.5 flex aspect-square h-5 items-center justify-center rounded-full bg-red-400 text-xs",
                unreadNotificationsCount > 9 ? "h-5" : "h-4"
              )}
            >
              {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex max-h-[50vh] flex-col space-y-4 overflow-hidden rounded-xl p-4"
      >
        {notifications.length > 0 && (
          <div className="flex justify-end space-x-2 border-b pb-2">
            {unreadNotificationsCount > 0 && <ReadAllBtn />}
            <ClearAllBtn />
          </div>
        )}
        <div className="flex-grow space-y-4 overflow-y-auto">
          {notificationsItems}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ClearAllBtn() {
  const { trigger, isMutating } = useClearAllNotifications();
  return (
    <LoaderButton
      size="sm"
      variant="ghost"
      onClick={trigger}
      isLoading={isMutating}
    >
      Clear All
    </LoaderButton>
  );
}

function ReadAllBtn() {
  const { trigger, isMutating } = useReadAllNotifications();
  return (
    <LoaderButton
      size="sm"
      variant="ghost"
      onClick={trigger}
      isLoading={isMutating}
    >
      Read All
    </LoaderButton>
  );
}

function NotificationItem({
  notification: nt,
  setOpen,
}: {
  notification: Notification;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  if (nt.event === FRIEND_REQUEST_EVENT) {
    const data = nt.data as FriendRequest;
    return (
      <Link
        href="/game-chat/friend-requests"
        className="block space-x-1"
        onClick={() => setOpen(false)}
      >
        <span> You have new friend request from</span>
        <span className="font-extrabold">{data.requester?.name}</span>
      </Link>
    );
  }
  if (nt.event === FRIEND_REQUEST_ACCEPTED_EVENT) {
    const data = nt.data as FriendRequest;
    return (
      <div className="space-x-1">
        <span className="font-extrabold">{data.recipient?.name}</span>
        <span>accept you friend request</span>
      </div>
    );
  }
  return <></>;
}
