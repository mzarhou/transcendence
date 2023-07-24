"use client";

import { useUser } from "@/context/user-context";
import { MessageType } from "@transcendence/common";
import { useEffect, useMemo, useState } from "react";

const useFirstUnreadMessage = (messages: MessageType[]) => {
  const { user } = useUser();
  const [firstRun, setFirstRun] = useState(false);
  const [message, setMessage] = useState<MessageType | undefined>(undefined);

  useEffect(() => {
    if (firstRun || messages.length === 0 || !user) return;
    const msg = messages.find(
      (msg) => !msg.isRead && msg.recipientId === user.id
    );
    setFirstRun(true);
    setMessage(msg);
  }, [messages, user]);

  const unreadMessageExist = useMemo(() => {
    if (messages.length === 0) return true;
    return !!messages.find(
      (msg) => !msg.isRead && msg.recipientId === user?.id
    );
  }, [messages, user]);

  return { firstUnreadMessage: message, unreadMessageExist };
};

export { useFirstUnreadMessage };
