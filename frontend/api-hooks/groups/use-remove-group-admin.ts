import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupKey } from "../use-group";
import { RemoveGroupAdminType } from "@transcendence/common";

export const useRemoveGroupAdmin = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/remove-admin`,
    async (url, { arg }: { arg: RemoveGroupAdminType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to remove admin"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User is a member now" });
        mutate(groupKey(groupId));
      },
    }
  );
};
