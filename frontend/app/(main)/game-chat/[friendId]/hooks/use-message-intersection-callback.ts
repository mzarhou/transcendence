import { useCallback } from "react";
import { visibleMessagesAtom } from "../components/visible-messages";
import { useAtom } from "jotai";
import { useReadMessage } from "@/api-hooks/use-read-message";

const ROOT_EL_ID = "messages-wrapper";

let minMessageId: number = -1;
let maxMessageId: number = -1;
let to: NodeJS.Timeout | null = null;

const getMessageId = (messageElement: HTMLDivElement) => {
  const messageIdStr = messageElement.dataset["messageId"] ?? "invalid";
  if (messageIdStr.length === 0) throw "invalid message id";
  return parseInt(messageIdStr);
};

function useMessageIntersectionCallback(friendId: number) {
  const { trigger: readMessage } = useReadMessage(friendId);
  const [, setVisibleMessages] = useAtom(visibleMessagesAtom);

  const messagesIntersectionCallback: IntersectionObserverCallback =
    useCallback((entries) => {
      if (to) clearTimeout(to);

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const messageId = getMessageId(entry.target as HTMLDivElement);
          if (minMessageId == -1 || maxMessageId == -1) {
            minMessageId = messageId;
            maxMessageId = messageId;
          } else {
            minMessageId = Math.min(minMessageId, messageId);
            maxMessageId = Math.max(maxMessageId, messageId);
          }
        }
      }

      to = setTimeout(() => {
        setVisibleMessages(new Set([minMessageId, maxMessageId]));
        const messagesIds = Array(maxMessageId - minMessageId + 1)
          .fill(null)
          .map((_, index) => index + minMessageId)
          .filter((id) => id > -1);
        for (const msgId of messagesIds) {
          readMessage(msgId);
        }
        minMessageId = -1;
        maxMessageId = -1;
      }, 300);
    }, []);
  return messagesIntersectionCallback;
}

export { useMessageIntersectionCallback, ROOT_EL_ID };
