import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/context";
import { useUser } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { SignInType } from "@transcendence/db";
import { AxiosError } from "axios";
import useSWRMutation from "swr/mutation";

export const useSignIn = () => {
  const { toast } = useToast();
  const { refresh } = useUser();
  const socket = useSocket();

  const { trigger, ...rest } = useSWRMutation(
    "/authentication/sign-in",
    async (url, { arg }: { arg: SignInType }) => api.post(url, arg),
    {
      onSuccess: async () => {
        socket?.connect();
        await refresh();
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to sign in"),
          variant: "destructive",
        });
      },
    }
  );
  return { signin: trigger, ...rest };
};
