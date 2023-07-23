"use client";
import { useMessages } from "@/api-hooks/use-messages";
import { useEffect, useRef, useState } from "react";
import { isMessageVisible } from "../utils/is-message-visible";
import { useUser } from "@/context/user-context";
import { MessageType } from "@transcendence/common";

const NEW_MESSAGES_LINE_ID = "new-messages-line-id";

const useScroll = (friendId: number) => {
  const { data: messages } = useMessages(friendId);
  const [showMessages, setShowMessages] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useUser();
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);

  const isLastChildVisible = (): boolean => {
    const lastchild = wrapperRef.current?.lastChild as
      | Element
      | null
      | undefined;
    if (!lastchild || !wrapperRef.current) return false;
    const lastChildRec = lastchild.getBoundingClientRect();
    const messagesMargin = 16;
    return isMessageVisible(lastchild, wrapperRef.current, {
      scaleRootBottom: lastChildRec.height + messagesMargin * 3,
    });
  };

  useEffect(() => {
    if (showMessages || messages.length === 0) return;
    const newMessagesLineEl = document.getElementById(NEW_MESSAGES_LINE_ID);
    console.log({ messageRef: !!newMessagesLineEl });
    const el =
      newMessagesLineEl ??
      (wrapperRef.current?.lastChild as HTMLDivElement | undefined);
    el?.scrollIntoView({
      behavior: "instant",
      block: "start",
      inline: "end",
    });
    setShowMessages(true);
  }, [messages]);

  useEffect(() => {
    if (!showMessages || messages.length === 0) return;
    const lastchild = wrapperRef.current?.lastChild as Element | undefined;
    const newLastMessage = messages[messages.length - 1];
    if (
      (lastMessage &&
        lastMessage.id !== newLastMessage.id &&
        newLastMessage.senderId === currentUser?.id) ||
      isLastChildVisible()
    ) {
      lastchild?.scrollIntoView({
        behavior: showMessages ? "smooth" : "instant",
        block: "end",
        inline: "nearest",
      });
    }
    setLastMessage(newLastMessage);
  }, [messages]);

  return { wrapperRef, showMessages };
};

export { useScroll, NEW_MESSAGES_LINE_ID };
