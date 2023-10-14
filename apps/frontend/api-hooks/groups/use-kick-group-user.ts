import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupKey } from "./use-group";
import { KickUserType } from "@transcendence/db";

export const useKickGroupUser = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/kick-user`,
    async (url, { arg }: { arg: KickUserType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to kick user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User kicked out" });
        mutate(groupKey(groupId));
      },
    }
  );
};
