import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { MuteUserType } from "@transcendence/db";

export const useMuteGroupUser = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/mute`,
    async (url, { arg }: { arg: MuteUserType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to mute user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User muted succefully" });
        // TODO: refetch muted users
      },
    }
  );
};
