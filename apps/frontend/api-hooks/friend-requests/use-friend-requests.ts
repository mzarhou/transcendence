import { api } from "@/lib/api";
import { FriendRequestWithRequester } from "@transcendence/db";
import { FriendRequest } from "@transcendence/db";
import useSWR from "swr";

export const friendRequestsKey = "/chat/friend-request/received";
export function useFriendRequests() {
  return useSWR(friendRequestsKey, (url) =>
    api
      .get<(FriendRequest & FriendRequestWithRequester)[]>(url)
      .then((data) => data.data)
  );
}
