import { api } from "@/lib/api";
import { GroupMessageWithSender } from "@transcendence/common";
import { GroupMessage } from "@transcendence/common";
import useSWR from "swr";

export const getGroupMessagesKey = (id: string) => `/groups/${id}/messages`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useGroupMessages(groupId: string) {
  const res = useSWR(getGroupMessagesKey(groupId), async (url) =>
    api
      .get<(GroupMessage & GroupMessageWithSender)[]>(url)
      .then((data) => data.data),
  );
  return {
    ...res,
    data: res.data ?? [],
  };
}
