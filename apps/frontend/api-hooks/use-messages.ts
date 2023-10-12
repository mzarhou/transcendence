import { api } from "@/lib/api";
import { MessageType } from "@transcendence/db";
import useSWR from "swr";

export const getMessagesKey = (friendId: number) =>
  `/chat/${friendId}/messages`;

export function useMessages(friendId: number) {
  const data = useSWR(getMessagesKey(friendId), (url) =>
    api.get<MessageType[]>(url).then((data) => data.data)
  );
  return {
    ...data,
    data: data.data ?? [],
  };
}
