import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupKey } from "../use-group";
import { AddGroupAdminType } from "@transcendence/common";

export const useAddGroupAdmin = (groupId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${groupId}/add-admin`,
    async (url, { arg }: { arg: AddGroupAdminType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to set user as admin"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "User is admin now" });
        mutate(groupKey(groupId));
      },
    }
  );
};
