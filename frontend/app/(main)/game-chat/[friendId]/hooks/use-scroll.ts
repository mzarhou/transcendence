"use client";

import { useMessages } from "@/api-hooks/use-messages";
import { RefObject, useEffect, useRef, useState } from "react";
import { isMessageVisible } from "../utils/is-message-visible";
import { useUser } from "@/context/user-context";
import { MessageType } from "@transcendence/common";
import { useFirstUnreadMessage } from "./use-first-unread-message";

const NEW_MESSAGES_LINE_ID = "new-messages-line-id";

const useScroll = (friendId: number) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: messages } = useMessages(friendId);
  const { showMessages, firstUnreadMessage } = useFirstScroll(
    wrapperRef,
    messages
  );
  useLastMessageScroll(wrapperRef, messages, showMessages);
  return { wrapperRef, showMessages, firstUnreadMessage };
};

const useFirstScroll = (
  wrapperRef: RefObject<HTMLDivElement>,
  messages: MessageType[]
) => {
  const [showMessages, setShowMessages] = useState(false);
  const { firstUnreadMessage, unreadMessageExist } =
    useFirstUnreadMessage(messages);

  useEffect(() => {
    if (
      showMessages ||
      messages.length === 0 ||
      (!firstUnreadMessage && unreadMessageExist)
    )
      return;
    const newMessagesLineEl = document.getElementById(NEW_MESSAGES_LINE_ID);
    const el =
      newMessagesLineEl ??
      (wrapperRef.current?.lastChild as HTMLDivElement | undefined);
    if (!el) throw "invalid scroll target element";
    el.scrollIntoView(true);
    setShowMessages(true);
  }, [messages, firstUnreadMessage]);

  return { showMessages, firstUnreadMessage };
};

const useLastMessageScroll = (
  wrapperRef: RefObject<HTMLDivElement>,
  messages: MessageType[],
  showMessages: boolean
) => {
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);
  const { user: currentUser } = useUser();

  const isLastChildVisible = (): boolean => {
    const lastchild = wrapperRef.current?.lastChild as Element | undefined;
    if (!lastchild || !wrapperRef.current) return false;
    const lastChildRec = lastchild.getBoundingClientRect();
    const messagesMargin = 16;
    return isMessageVisible(lastchild, wrapperRef.current, {
      scaleRootBottom: lastChildRec.height + messagesMargin * 3,
    });
  };

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
  return { wrapperRef };
};

export { useScroll, NEW_MESSAGES_LINE_ID };
