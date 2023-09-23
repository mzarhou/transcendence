import { api } from "@/lib/api";
import { SearchUser } from "@transcendence/common";
import useSWR from "swr";

export const getSearchGroupsInvitableUsersKey = (
  groupId: number,
  query: string
) => `/groups/${groupId}/search-invitable-users?term=${query}`;

export function useGroupSearchInvitableUsers(data: {
  groupId: number;
  searchTerm: string;
}) {
  const groupsQuery = useSWR(
    getSearchGroupsInvitableUsersKey(data.groupId, data.searchTerm),
    (url) => api.get<SearchUser[]>(url).then((data) => data.data)
  );
  return { ...groupsQuery, data: groupsQuery.data ?? [] };
}
