"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import {
  MessageType,
  MESSAGE_EVENT,
  SendMessageType,
} from "@transcendence/common";
import { useUser } from "@/context/user-context";
import { useSocket } from "@/context/events-socket-context";
import { useMessages } from "@/api-hooks/use-messages";

const useChat = (friendId: number) => {
  const socket = useSocket();
  const { user: currentUser } = useUser();
  const { data, isLoading } = useMessages(friendId);
  const [messages, setMessages] = useState<MessageType[]>(data ?? []);

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!socket || isSubscribed) return;
    socket.on(MESSAGE_EVENT, (data: MessageType) => {
      if (data.senderId === friendId || data.senderId === currentUser!.id) {
        setMessages((msgs) => [...(msgs ?? []), data]);
      }
    });
    setIsSubscribed(true);
  }, [socket]);

  useEffect(() => {
    if (!data) return;
    setMessages([...data]);
  }, [data]);

  return { socket, messages, isLoading };
};

type ChatBodyProps = {
  friendId: number;
};
export default function ChatBody({ friendId }: ChatBodyProps) {
  const { user } = useUser();
  const [showMessages, setShowMessages] = useState(false);
  const { socket, messages, isLoading } = useChat(friendId);

  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;
    const lastchild = wrapper.current?.lastChild as Element | null | undefined;
    lastchild?.scrollIntoView({
      behavior: showMessages ? "smooth" : "instant",
      block: "end",
      inline: "nearest",
    });
    if (!showMessages) setShowMessages(true);
  }, [messages]);

  return (
    <div className="flex h-0 flex-grow flex-col space-y-6">
      <div
        ref={wrapper}
        className={cn(
          "flex flex-grow flex-col space-y-4 overflow-y-auto px-4",
          { invisible: !showMessages }
        )}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "w-2/3 rounded-md bg-chat-card px-4 py-4 text-chat-card-foreground",
                { "self-end": user?.id === msg.senderId }
              )}
            >
              {msg.message}
            </div>
          ))
        ) : (
          <FullPlaceHolder
            text="No messages found"
            className="text-chat-foreground/30"
          />
        )}
      </div>
      <form
        className="w-full border-t"
        onSubmit={(e) => {
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
        }}
      >
        <input
          autoFocus
          name="message"
          placeholder="new message"
          className="w-full border-border bg-transparent px-5 py-4 ring-ring focus:outline-none focus:ring"
        />
      </form>
    </div>
  );
}
