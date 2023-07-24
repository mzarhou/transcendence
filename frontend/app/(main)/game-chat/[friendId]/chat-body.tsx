"use client";

import { cn } from "@/lib/utils";
import { FormEventHandler, useEffect, useMemo, useRef } from "react";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import {
  MESSAGE_EVENT,
  SendMessageType,
  MessageType,
} from "@transcendence/common";
import {
  IntersectionObserverProvider,
  useIntersectionObserver,
} from "./context/intersection-observer-context";
import {
  ROOT_EL_ID,
  useMessageIntersectionCallback,
} from "./hooks/use-message-intersection-callback";
import { Check, CheckCheck } from "lucide-react";
import { useUser } from "@/context/user-context";
import { useSocket } from "@/context/events-socket-context";
import { useMessages } from "@/api-hooks/use-messages";
import { NEW_MESSAGES_LINE_ID, useScroll } from "./hooks/use-scroll";

type ChatBodyProps = {
  friendId: number;
};
export default function ChatBody({ friendId }: ChatBodyProps) {
  const messagesIntersectionCallback = useMessageIntersectionCallback(friendId);

  return (
    <IntersectionObserverProvider callback={messagesIntersectionCallback}>
      <div className="flex h-0 flex-grow flex-col space-y-6">
        <ChatMessages friendId={friendId} />
        <ChatInput friendId={friendId} />
      </div>
    </IntersectionObserverProvider>
  );
}

function ChatInput({ friendId }: { friendId: number }) {
  const socket = useSocket();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const message = new FormData(form).get("message") as string;
    if (message.length === 0) return;
    const data: SendMessageType = {
      message,
      recipientId: friendId,
    };
    socket?.emit(MESSAGE_EVENT, data);
    form.reset();
  };

  return (
    <form className="w-full border-t" onSubmit={onSubmit}>
      <input
        autoFocus
        name="message"
        placeholder="new message"
        className="w-full border-border bg-transparent px-5 py-4 ring-ring focus:outline-none focus:ring"
      />
    </form>
  );
}

function ChatMessages({ friendId }: { friendId: number }) {
  const { data: messages } = useMessages(friendId);
  const { showMessages, wrapperRef, firstUnreadMessage } = useScroll(friendId);

  return (
    <div
      id={ROOT_EL_ID}
      ref={wrapperRef}
      className={cn("flex flex-grow flex-col space-y-4 overflow-y-auto px-4", {
        invisible: !showMessages,
      })}
    >
      {messages.length > 0 ? (
        [
          messages.map((msg) => {
            if (!firstUnreadMessage || msg.id !== firstUnreadMessage?.id)
              return (
                <MessageItem key={msg.id} message={msg} friendId={friendId} />
              );
            return [
              <div
                id={NEW_MESSAGES_LINE_ID}
                key={NEW_MESSAGES_LINE_ID}
                className="flex items-center"
              >
                <div className="inline-block h-[3px] flex-grow rounded-l-full bg-red-500" />
                <div className="flex items-center justify-center rounded-l-full bg-red-500 pl-2 pr-1 text-xs uppercase">
                  New
                </div>
              </div>,
              <MessageItem key={msg.id} message={msg} friendId={friendId} />,
            ];
          }),
        ]
      ) : (
        <FullPlaceHolder
          text="No messages found"
          className="text-chat-foreground/30"
        />
      )}
    </div>
  );
}

type MessageItemProps = {
  message: MessageType;
  friendId: number;
};
function MessageItem({ message: msg }: MessageItemProps) {
  const { user } = useUser();
  const observer = useIntersectionObserver();
  const messageRef = useRef<HTMLDivElement>(null);

  const shoulBeObserved = msg.recipientId === user?.id && !msg.isRead;
  useEffect(() => {
    const rootEl = document.getElementById(ROOT_EL_ID);
    if (!rootEl) throw "root element is undefined";
    if (!observer || !messageRef.current || !shoulBeObserved) return;
    observer.observe(messageRef.current);
  }, [observer, user]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "w-2/3 rounded-md  px-4 pb-3 pt-4 text-chat-card-foreground",
        { "self-end": user?.id === msg.senderId },
        shoulBeObserved ? "bg-red-500 text-black" : "bg-chat-card"
      )}
      data-message-id={msg.id}
    >
      {msg.id}

      {/* sent | received | read */}
      {msg.senderId === user?.id && (
        <div className="-mt-2 flex justify-end">
          {msg.isRead ? (
            <CheckCheck className="h-5 w-5 text-blue-500" />
          ) : (
            <Check className="h-5 w-5" />
          )}
        </div>
      )}
    </div>
  );
}
