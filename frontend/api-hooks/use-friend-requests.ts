import { api } from "@/lib/api";
import { FriendRequest } from "@transcendence/common";
import useSWR from "swr";

export const friendRequestsKey = "/chat/friend-request/received";
export function useFriendRequests() {
  return useSWR(friendRequestsKey, (url) =>
    api.get<FriendRequest[]>(url).then((data) => data.data)
  );
}
