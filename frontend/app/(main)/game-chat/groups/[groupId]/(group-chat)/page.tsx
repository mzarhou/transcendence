"use client";
import { useGroupMessages } from "@/api-hooks/groups/use-group-messages";
import GoBackBtn from "../../../components/chat-go-back";
import { Input } from "@/components/ui/input";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendGroupMessage } from "@/api-hooks/groups/use-send-group-message";
import { GroupMessage, GroupMessageWithSender } from "@transcendence/common";
import { useUser } from "@/context/user-context";
import Link from "next/link";
import { useGroup } from "@/api-hooks/groups/use-group";

export default function GroupChatPage({
  params,
}: {
  params: { groupId: string };
}) {
  const { user } = useUser();
  const { data: group } = useGroup(params.groupId);
  const { trigger } = useSendGroupMessage();
  const { data: messages, mutate } = useGroupMessages(params.groupId);
  const [message, setMessage] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const sendMessage: FormEventHandler = async (e) => {
    e.preventDefault();
    if (message.length === 0 || !user) return;
    try {
      const groupId = parseInt(params.groupId);
      // Mutate cache directly
      mutate(
        [
          ...messages,
          {
            id: Math.floor(Math.random() * 1239742323),
            groupId,
            message,
            senderId: user.id,
            sender: { avatar: user.avatar } as any,
            createdAt: new Date(),
            updatedAt: new Date(),
          } satisfies GroupMessage & GroupMessageWithSender,
        ],
        { revalidate: false },
      );
      await trigger({ message, groupId });
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      mutate();
    } finally {
      setMessage("");
    }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !wrapper.lastChild) return;
    const lastChild = wrapper.lastChild as Element;
    lastChild.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex items-center justify-between pr-4">
        <GoBackBtn full={false}>
          <Link href={`${params.groupId}/info`}>
            <h3 className="sm">{group?.name}</h3>
          </Link>
        </GoBackBtn>
        <Link href={`${params.groupId}/info`}>
          <Info />
        </Link>
      </div>

      <div className="flex h-0 flex-col flex-grow">
        <div
          ref={wrapperRef}
          className="flex flex-grow flex-col space-y-4 overflow-y-auto px-4"
        >
          {messages.map((msg, index) => {
            return (
              <div
                key={msg.id}
                className={cn("flex space-x-2  w-[80%]", {
                  "self-end": msg.senderId === user?.id,
                })}
              >
                <div>
                  <img
                    src={msg.sender.avatar}
                    className={cn(
                      "w-6 h-6 min-h-[24px] min-w-[24px] rounded-full mt-2",
                      {
                        hidden: msg.senderId === user?.id,
                      },
                    )}
                  />
                </div>
                <div
                  key={index}
                  className={cn(
                    "bg-chat-card text-card-foreground rounded-lg p-2 w-full py-4 break-words",
                  )}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={sendMessage} className="flex space-x-2 p-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="message"
          />
          <Button>
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </>
  );
}
