import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import useSWRMutation from "swr/mutation";
import { InviteUserToGroupType } from "@transcendence/common";

export const useInviteUser = (groupId: number, onSuccess?: () => void) => {
  const { toast } = useToast();

  return useSWRMutation(
    `/groups/${groupId}/invitations`,
    async (url, { arg }: { arg: InviteUserToGroupType }) => api.post(url, arg),
    {
      onSuccess: () => {
        toast({ description: "User Invited" });
        onSuccess?.();
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to invite user"),
          variant: "destructive",
        });
      },
    }
  );
};
