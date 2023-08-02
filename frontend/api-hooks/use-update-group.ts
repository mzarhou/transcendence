import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { UpdateGroupType } from "@transcendence/common";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { groupKey } from "./use-group";

export const useUpdateGroup = (groupId: string) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const mutation = useSWRMutation(
    `/groups/${groupId}`,
    async (url, { arg }: { arg: UpdateGroupType }) => api.patch(url, arg),
    {
      onSuccess: () => {
        toast({ description: "Group updated" });
        mutate(groupKey(groupId));
        router.push(`/game-chat/groups/${groupId}/info`);
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to update group"),
          variant: "destructive",
        });
      },
    }
  );
  return {
    ...mutation,
    trigger: (arg: UpdateGroupType) => mutation.trigger(arg).catch((_e) => {}),
  };
};
