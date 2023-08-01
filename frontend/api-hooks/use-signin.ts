import { useToast } from "@/components/ui/use-toast";
import { getServerMessage } from "@/lib/utils";
import { SignInType } from "@transcendence/common";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useSignIn = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const { trigger, ...rest } = useSWRMutation(
    "/api/auth/login",
    async (url, { arg }: { arg: SignInType }) => axios.post(url, arg),
    {
      onSuccess: async () => {
        await mutate("/users/me");
        toast({ description: "You are logged in" });
        router.replace("/game-chat");
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
