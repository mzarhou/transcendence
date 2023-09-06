import { useToast } from "@/components/ui/use-toast";
import { USER_KEY } from "@/context/user-context";
import { api } from "@/lib/api";
import { Provide2faCodeType } from "@transcendence/common";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export const useProvide2faCode = () => {
  const { toast } = useToast();

  const router = useRouter();

  return useSWRMutation(
    "/authentication/2fa/code",
    (url, { arg }: { arg: Provide2faCodeType }) => api.post(url, arg),
    {
      onSuccess: async () => {
        toast({ description: "Success" });
        await mutate(USER_KEY);
        router.replace("/game-chat");
      },
      onError: (error) => {
        let message = "Failed";
        if (error instanceof AxiosError) {
          message = error.message;
        }
        toast({
          description: message,
          variant: "destructive",
        });
      },
    },
  );
};
