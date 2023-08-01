import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useEnable2fa = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
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
      onSuccess: () => {
        toast({ description: "2FA is enabled" });
        mutate("/users/me");
      },
    }
  );

  return {
    enable2FA: trigger,
    ...rest,
  };
};
