"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import FullPlaceHolder from "@/components/ui/full-placeholder";

interface Message {
  message: string;
  incomming: boolean;
}

export default function ChatPage({
  params: { friendId },
}: {
  params: { friendId: string };
}) {
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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

  function addNewMessage(message: string) {
    if (message.length === 0) return;
    const values = [false, true];
    const incomming = values[Math.floor(Math.random() * values.length)];
    setMessages((msgs) => [...msgs, { message, incomming }]);
  }

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
                { "self-end": msg.incomming }
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
          addNewMessage(message);
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
