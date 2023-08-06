import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupKey } from "./use-group";
import { BanUserType } from "@transcendence/common";
import { groupUsersKey } from "./use-group-users";

export const useBanGroupUser = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/ban-user`,
    async (url, { arg }: { arg: BanUserType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to ban user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User banned" });
        mutate(groupKey(groupId));
        mutate(groupUsersKey({ groupId, filter: "banned" }));
      },
    }
  );
};
