import { useToast } from "@/components/ui/use-toast";
import { USER_KEY } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { SignInType } from "@transcendence/common";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useSignIn = () => {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const { trigger, ...rest } = useSWRMutation(
    "/authentication/sign-in",
    async (url, { arg }: { arg: SignInType }) => api.post(url, arg),
    {
      onSuccess: async () => {
        await mutate(USER_KEY);
        toast({ description: "You are logged in" });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const { response, code } = error;
          console.log({ response, code });
        }
        toast({
          description: getServerMessage(error, "Failed to sign in"),
          variant: "destructive",
        });
      },
    }
  );
  return { signin: trigger, ...rest };
};
