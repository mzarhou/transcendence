import { api } from "@/lib/api";
import { User } from "@transcendence/db";
import useSWR from "swr";

export const blockedUsersKey = "/chat/blocked";

export function useBlockedUsers() {
  return useSWR(blockedUsersKey, (url) =>
    api.get<User[]>(url).then((data) => data.data)
  );
}
