import { api } from "@/lib/api";
import { User } from "@transcendence/common";
import useSWR from "swr";

export function useFriend(userId: string) {
  return useSWR(`/users/${userId}`, (url) =>
    api.get<User>(url).then((data) => data.data),
  );
}
