"use client";
import { useMessages } from "@/api-hooks/use-messages";
import { useUser } from "@/context/user-context";
import { useEffect, useState } from "react";

const useLazyFirstUnreadMessageId = ({
  updateInterval,
  friendId,
}: {
  friendId: number;
  updateInterval: number;
}) => {
  const { data: messages } = useMessages(friendId);
  const { user: currentUser } = useUser();
  const [id, setId] = useState<number>(-1);
  const [firstRun, setFirstRun] = useState<boolean>(false);

  const setFirstMessageId = () => {
    const message = messages.find(
      (msg) => !msg.isRead && msg.recipientId === currentUser?.id
    );
    setId(message?.id ?? -1);
  };

  useEffect(() => {
    if (!firstRun) {
      setFirstMessageId();
      setFirstRun(true);
    } else {
      const to = setTimeout(() => {
        setFirstMessageId();
      }, updateInterval);
      return () => clearTimeout(to);
    }
  }, [messages]);

  return id;
};

export { useLazyFirstUnreadMessageId };
