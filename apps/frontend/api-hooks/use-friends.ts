import { api } from "@/lib/api";
import { User } from "@transcendence/db";
import useSWR from "swr";

export const friendsKey = "/chat/friends";

export function useFriends() {
  return useSWR(friendsKey, (url) =>
    api.get<User[]>(url).then((data) => data.data)
  );
}
