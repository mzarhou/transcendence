import { api } from "@/lib/api";
import { Notification } from "@transcendence/db";
import useSWR from "swr";

export const notificationsKey = "/notifications";

export function useNotifications() {
  const res = useSWR(notificationsKey, (url) =>
    api.get<Notification[]>(url).then((data) => data.data)
  );
  return {
    ...res,
    data: res.data ?? [],
  };
}
