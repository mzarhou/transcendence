import { api } from "@/lib/api";
import {
  GroupUsersFilter,
  UserGroup,
  UserGroupRole,
} from "@transcendence/common";
import useSWR from "swr";

type GroupUsersProps = GroupUsersFilter & {
  groupId: string;
};

export const groupUsersKey = ({ groupId, filter }: GroupUsersProps) => {
  const searchParams = new URLSearchParams({
    filter,
  } satisfies GroupUsersFilter);
  return `/groups/${groupId}/users?${searchParams}`;
};

export function useGroupUsers(props: GroupUsersProps) {
  return useSWR(groupUsersKey(props), (url) =>
    api
      .get<(UserGroup & { role: UserGroupRole | undefined })[]>(url)
      .then((data) => data.data)
  );
}
