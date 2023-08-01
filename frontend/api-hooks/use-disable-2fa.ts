import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useDisable2fa = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/authentication/2fa/disable",
    async (url, { arg: tfaCode }: { arg: string }) => {
      await api.post(url, { tfaCode });
    },
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to disable 2FA"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "2FA is disabled" });
        mutate("/users/me");
      },
    }
  );
  return {
    disable2FA: trigger,
    ...rest,
  };
};
