import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { CreateGameInvitationType } from "@transcendence/db";

export const useCreateGameInvitation = () => {
  const { toast } = useToast();

  return useSWRMutation(
    `/game-invitations`,
    async (url, { arg }: { arg: CreateGameInvitationType }) =>
      api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to send invitation"),
          variant: "destructive",
        });
      },
    }
  );
};
