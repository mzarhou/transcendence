import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { unreadMessagesKey } from "./use-unread-messages";
import { getMessagesKey } from "./use-messages";

export const useReadMessage = (friendId: number) => {
  const { mutate } = useSWRConfig();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/read-message`,
    async (url, { arg: messageId }: { arg: number }) =>
      api.patch(url + `/${messageId}`),
    {
      onSuccess: () => {
        mutate(unreadMessagesKey);
        mutate(getMessagesKey(friendId));
      },
    }
  );

  return {
    trigger: (messageId: number) => trigger(messageId).catch((_e) => {}),
    ...rest,
  };
};
