import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupsKey } from "./use-groups";

export const useRemoveInvitation = (invitationId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${invitationId}/invitations`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Invitation removed"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Failed to remove invitation" });
        mutate(groupsKey);
      },
    }
  );
};
