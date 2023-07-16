"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { io, Socket } from "socket.io-client";
import { MessageType } from "@transcendence/common";
import { useUser } from "@/context/user-context";
import { getSocket } from "./get-socket";

const useSocket = (friendId: number) => {
  const { user: currentUser } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const _socket = getSocket();
    _socket.on("chat", (data: MessageType) => {
      if (data.userId === friendId || data.userId === currentUser!.id) {
        setMessages((msgs) => [...msgs, data]);
      }
    });
    setSocket(_socket);
  }, [currentUser]);

  return { socket, messages };
};

type ChatBodyProps = {
  friendId: number;
};
export default function ChatBody({ friendId }: ChatBodyProps) {
  const { user } = useUser();
  const [showMessages, setShowMessages] = useState(false);
  const { socket, messages } = useSocket(friendId);

  const inputRef = useAutoFocus();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastchild = wrapper.current?.lastChild as Element | null | undefined;
    lastchild?.scrollIntoView({ block: "end", inline: "nearest" });
    setShowMessages(true);
  }, []);

  useEffect(() => {
    const lastchild = wrapper.current?.lastChild as Element;
    if (!lastchild) return;
    lastchild.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
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
                { "self-end": user?.id === msg.userId }
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
          const data: MessageType = {
            message,
            userId: friendId,
          };
          socket?.emit("chat", data);
          form.reset();
        }}
      >
        <input
          ref={inputRef}
          name="message"
          placeholder="new message"
          className="w-full border-border bg-transparent px-5 py-4 ring-ring focus:outline-none focus:ring"
        />
      </form>
    </div>
  );
}
