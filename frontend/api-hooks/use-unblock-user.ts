import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { blockedUsersKey } from "./use-blocked-users";
import { getServerMessage } from "@/lib/utils";

export const useUnblockUser = (userId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/unblock/${userId}`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to unblock user"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User unblocked" });
        mutate(blockedUsersKey);
      },
    }
  );

  return {
    trigger: () => trigger().catch((_e) => {}),
    ...rest,
  };
};
