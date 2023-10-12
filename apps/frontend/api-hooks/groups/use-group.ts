import { api } from "@/lib/api";
import { Group, GroupWithUsers, UserGroupRole } from "@transcendence/db";
import useSWR from "swr";
import { z } from "zod";

export const groupKey = (id: string) => "/groups/" + id;

export type GroupType = Group & GroupWithUsers & { role: UserGroupRole };

export const useGroup = (groupId: string) => {
  return useSWR(groupKey(groupId), async (url) => {
    const parseResult = z.string().regex(/^\d+$/).safeParse(groupId);
    if (!parseResult.success) throw new Error("invalid group id");
    const { data } = await api.get<
      Group & GroupWithUsers & { role: UserGroupRole }
    >(url);
    return data;
  });
};
