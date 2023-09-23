import { api } from "@/lib/api";
import { UserGroupInvitation } from "@transcendence/common";
import useSWR from "swr";

export const groupInvitationsKey = "/groups/invitations/all";

export function useGroupInvitations() {
  const groupsQuery = useSWR(groupInvitationsKey, (url) =>
    api.get<UserGroupInvitation[]>(url).then((data) => data.data)
  );
  return { ...groupsQuery, data: groupsQuery.data ?? [] };
}
