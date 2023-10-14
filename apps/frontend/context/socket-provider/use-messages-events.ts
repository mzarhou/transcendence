import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "../user-context";
import { useSWRConfig } from "swr";
import {
  MESSAGE_EVENT,
  MESSAGE_READ_EVENT,
  MessageType,
} from "@transcendence/db";
import { unreadMessagesKey } from "@/api-hooks/use-unread-messages";
import { getMessagesKey } from "@/api-hooks/use-messages";

export default function useMessagesEvents(socket: Socket) {
  const { user } = useUser();
  const { mutate } = useSWRConfig();

  const onMessage = useOnMessage();

  useEffect(() => {
    if (!user) return;
    if (socket.hasListeners(MESSAGE_EVENT)) return;

    socket.on(MESSAGE_EVENT, (data: MessageType) => onMessage(data));
    socket.on(MESSAGE_READ_EVENT, (data: MessageType) => {
      const friendId = getFriendIdFromMessage(user.id, data);
      mutate(getMessagesKey(friendId));
      mutate(unreadMessagesKey);
    });
  }, [user]);
}

function getFriendIdFromMessage(userId: number, data: MessageType) {
  return data.recipientId === userId ? data.senderId : data.recipientId;
}

const useOnMessage = () => {
  const { mutate } = useSWRConfig();
  const { user: currentUser } = useUser();

  const onMessage = useCallback(
    (data: MessageType) => {
      if (!currentUser) return;

      const friendId = getFriendIdFromMessage(currentUser.id, data);
      mutate(getMessagesKey(friendId));
      mutate(unreadMessagesKey);
    },
    [currentUser]
  );
  return onMessage;
};
