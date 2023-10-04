import { api } from "@/lib/api";
import { MessageType } from "@transcendence/db";
import useSWR from "swr";

export const unreadMessagesKey = "/chat/unread-messages";

export function useUnreadMessages() {
  const res = useSWR(unreadMessagesKey, (url) =>
    api.get<MessageType[]>(url).then((data) => data.data)
  );
  return {
    ...res,
    data: res.data ?? [],
  };
}

export function useFriendUreadMessagesCount(friendId: number) {
  const { data } = useUnreadMessages();
  return data.filter((msg) => msg.senderId === friendId).length;
}
