import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { groupInvitationsKey } from "./use-group-invitations";
import { groupsKey } from "./use-groups";

export const useAcceptGroupInvitation = (invitationId: string) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    `/groups/invitations/${invitationId}/accept`,
    (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to accept invitation"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Invitation Accepted" });
        mutate(groupInvitationsKey);
        mutate(groupsKey);
      },
    }
  );
};
