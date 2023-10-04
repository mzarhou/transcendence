import { api } from "@/lib/api";
import { GroupWithRole } from "@transcendence/db";
import useSWR from "swr";

export const groupsKey = "/groups";

export function useGroups() {
  const groupsQuery = useSWR(groupsKey, (url) =>
    api.get<GroupWithRole[]>(url).then((data) => data.data)
  );
  return { ...groupsQuery, data: groupsQuery.data ?? [] };
}
