import { useToast } from "@/components/ui/use-toast";
import { useRevalidateGroupsSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { Group, JoinGroupType } from "@transcendence/db";
import useSWRMutation from "swr/mutation";
import { groupsKey } from "./use-groups";
import { useSWRConfig } from "swr";

export const userJoinGroup = (group: Group) => {
  const { toast } = useToast();
  const { revalidateGroupsSearch } = useRevalidateGroupsSearch();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${group.id}/join`,
    async (url, { arg }: { arg: JoinGroupType }) => api.post(url, arg),
    {
      onSuccess: () => {
        toast({ description: `You have join ${group.name} group` });
        revalidateGroupsSearch();
        mutate(groupsKey);
      },
      onError: (error) => {
        const message = getServerMessage(
          error,
          `Failed to join ${group.name} group`
        );
        toast({
          description: message,
          variant: "destructive",
        });
      },
    }
  );
};
