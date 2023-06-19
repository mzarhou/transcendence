import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
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
        let message = "Failed to enable 2FA";
        if (error instanceof AxiosError) {
          message = error.message;
        }
        toast({
          description: message,
          className: "bg-red-200",
        });
      },
      onSuccess: () => {
        toast({
          description: "2FA is enabled",
          className: "bg-green-200",
        });
        mutate("/users/me");
      },
    }
  );

  return {
    enable2FA: trigger,
    ...rest,
  };
};
