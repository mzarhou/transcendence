import { api } from "@/lib/api";
import { MessageType } from "@transcendence/common";
import useSWR from "swr";

export function useMessages(friendId: number) {
  return useSWR(`/chat/${friendId}/messages`, (url) =>
    api.get<MessageType[]>(url).then((data) => data.data)
  );
}
