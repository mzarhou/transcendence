import { useReadMessage } from "@/api-hooks/use-read-message";
import { isMessageVisible } from "../utils/is-message-visible";
import { useCallback } from "react";

const ROOT_EL_ID = "messages-wrapper";

const getMessageId = (messageElement: HTMLDivElement) => {
  const messageIdStr = messageElement.dataset["messageId"] ?? "invalid";
  if (messageIdStr.length === 0) throw "invalid message id";
  return parseInt(messageIdStr);
};

function useMessageIntersectionCallback(friendId: number) {
  const { trigger: readMessage } = useReadMessage(friendId);

  const messagesIntersectionCallback: IntersectionObserverCallback =
    useCallback((entries, observer) => {
      if (!observer.root)
        throw "useMessageIntersectionCallback: root element is undefined";

      for (const entry of entries) {
        if (!entry.isIntersecting) return;
        try {
          const messageId = getMessageId(entry.target as HTMLDivElement);
          if (!isMessageVisible(entry.target, observer.root as Element)) return;
          readMessage(messageId);
        } catch (error) {
          console.error(error);
        }
      }
    }, []);
  return messagesIntersectionCallback;
}

export { useMessageIntersectionCallback, ROOT_EL_ID };
