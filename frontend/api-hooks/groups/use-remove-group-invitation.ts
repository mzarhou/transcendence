import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupInvitationsKey } from "./use-group-invitations";

export const useRemoveGroupInvitation = (invitationId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/${invitationId}/invitations`,
    async (url) => api.delete(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to remove invitation"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Invitation removed" });
        mutate(groupInvitationsKey);
      },
    }
  );
};
