import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { groupsKey } from "./use-groups";

export const useLeaveGroup = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  return useSWRMutation(
    `/groups/${groupId}/leave`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to leave group"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: `You've left the group` });
        mutate(groupsKey);
        router.replace("/game-chat");
      },
    },
  );
};
