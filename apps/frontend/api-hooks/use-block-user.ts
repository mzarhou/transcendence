import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { blockedUsersKey } from "./use-blocked-users";
import { friendsKey } from "./use-friends";
import { getServerMessage } from "@/lib/utils";

export const useBlockUser = (userId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/block/${userId}`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to block user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User blocked" });
        mutate(blockedUsersKey);
        mutate(friendsKey);
      },
    }
  );

  return {
    trigger: () => trigger().catch((_e) => {}),
    ...rest,
  };
};
