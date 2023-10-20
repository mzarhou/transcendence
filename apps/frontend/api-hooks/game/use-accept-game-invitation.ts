import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";

export const useAcceptGameInvitation = (invitationId: string) => {
  const { toast } = useToast();

  return useSWRMutation(
    `/game-invitations/${invitationId}/accept`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to accept invitation"),
          variant: "destructive",
        });
      },
    }
  );
};
