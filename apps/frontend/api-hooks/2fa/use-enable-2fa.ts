import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import useSWRMutation from "swr/mutation";

export const useEnable2fa = () => {
  const { toast } = useToast();
  const { refresh } = useUser();
  const { trigger, ...rest } = useSWRMutation(
    "/authentication/2fa/enable",
    async (url, { arg: tfaCode }: { arg: string }) => {
      return api.post(url, {
        tfaCode,
      });
    },
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to enable 2FA"),
          variant: "destructive",
        });
      },
      onSuccess: async () => {
        await refresh();
        toast({ description: "2FA is enabled" });
      },
    }
  );

  return {
    enable2FA: trigger,
    ...rest,
  };
};
