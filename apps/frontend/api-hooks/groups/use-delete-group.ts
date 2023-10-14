import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { groupsKey } from "./use-groups";

export const useDeleteGroup = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  return useSWRMutation(`/groups/${groupId}`, async (url) => api.delete(url), {
    onError: (error) => {
      toast({
        description: getServerMessage(error, "Failed to delete group"),
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({ description: "Group deleted" });
      mutate(groupsKey);
      router.replace("/game-chat");
    },
  });
};
