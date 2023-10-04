import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupKey } from "./use-group";
import { UnBanUserType } from "@transcendence/db";
import { groupUsersKey } from "./use-group-users";

export const useUnbanGroupUser = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/unban-user`,
    async (url, { arg }: { arg: UnBanUserType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to unban user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User unbanned" });
        mutate(groupKey(groupId));
        mutate(groupUsersKey({ groupId, filter: "banned" }));
      },
    }
  );
};
