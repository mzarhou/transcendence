import { api } from "@/lib/api";
import { User } from "@transcendence/common";
import useSWR from "swr";

export function useFriends() {
  return useSWR("/chat/friends", (url) =>
    api.get<User[]>(url).then((data) => data.data)
  );
}
