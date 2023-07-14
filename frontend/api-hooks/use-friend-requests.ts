import { api } from "@/lib/api";
import { FriendRequest } from "@transcendence/common";
import useSWR from "swr";

export function useFriendRequests() {
  return useSWR("/chat/friend-request/received", (url) =>
    api.get<FriendRequest[]>(url).then((data) => data.data)
  );
}
