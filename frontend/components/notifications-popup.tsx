"use client";

import { Bell } from "lucide-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useNotifications } from "@/api-hooks/notifications/use-notifications";
import { useReadAllNotifications } from "@/api-hooks/notifications/use-read-all-notifications";
import { useClearAllNotifications } from "@/api-hooks/notifications/use-clear-all-notifications";
import Link from "next/link";
import {
  FRIEND_REQUEST_EVENT,
  FRIEND_REQUEST_ACCEPTED_EVENT,
  FriendRequest,
  Notification,
  FriendRequestWithRequester,
  FriendRequestWithRecipient,
  GROUP_INVITATION_NOTIFICATION,
} from "@transcendence/common";
import { LoaderButton } from "./ui/loader-button";
import { NoticationsBadge } from "./ui/notifications-badge";
import { GROUP_DELETED_NOTIFICATION } from "@transcendence/common";
import { ADD_ADMIN_NOTIFICATION } from "@transcendence/common";
import { REMOVE_ADMIN_NOTIFICATION } from "@transcendence/common";
import { GROUP_BANNED_NOTIFICATION } from "@transcendence/common";
import { GROUP_UNBANNED_NOTIFICATION } from "@transcendence/common";
import { LEAVE_GROUP_NOTIFICATION } from "@transcendence/common";
import { JOIN_GROUP_NOTIFICATION } from "@transcendence/common";
import { GROUP_KICKED_NOTIFICATION } from "@transcendence/common";
import { GROUP_NOTIFICATION_PAYLOAD } from "@transcendence/common";

export default function NotificationsPopup() {
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();

  const notificationsItems =
    notifications.length > 0 ? (
      notifications.map((nt) => (
        <div key={nt.id} className="relative">
          <NotificationItem key={nt.id} notification={nt} setOpen={setOpen} />
          {!nt.isRead && (
            <div className="absolute right-0 top-1 h-2 w-2 rounded-full bg-primary-foreground dark:bg-primary"></div>
          )}
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
          <NoticationsBadge count={unreadNotificationsCount} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
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
    const data = nt.data as FriendRequest & FriendRequestWithRequester;
    return (
      <Link
        href="/game-chat/friend-requests"
        className="block space-x-1"
        onClick={() => setOpen(false)}
      >
        <span> You have new friend request from</span>
        <span className="font-extrabold">{data.requester.name}</span>
      </Link>
    );
  }
  if (nt.event === FRIEND_REQUEST_ACCEPTED_EVENT) {
    const data = nt.data as FriendRequest & FriendRequestWithRecipient;
    return (
      <div className="space-x-1">
        <span className="font-extrabold">{data.recipient.name}</span>
        <span>accept you friend request</span>
      </div>
    );
  }
  if (
    [
      GROUP_DELETED_NOTIFICATION,
      ADD_ADMIN_NOTIFICATION,
      REMOVE_ADMIN_NOTIFICATION,
      GROUP_BANNED_NOTIFICATION,
      GROUP_UNBANNED_NOTIFICATION,
      GROUP_KICKED_NOTIFICATION,
      JOIN_GROUP_NOTIFICATION,
      LEAVE_GROUP_NOTIFICATION,
    ].includes(nt.event)
  ) {
    const data = nt.data as GROUP_NOTIFICATION_PAYLOAD;
    return <data>{data.message}</data>;
  }

  if (nt.event === GROUP_INVITATION_NOTIFICATION) {
    return (
      <Link href="/game-chat/group-invitations">
        <div>{nt.data as string}</div>
      </Link>
    );
  }

  if (typeof nt.data === "object") {
    return <div>{JSON.stringify(nt.data)}</div>;
  } else if (typeof nt.data === "string") {
    return <div>{nt.data}</div>;
  }
  return <div>Unknow notification</div>;
}
