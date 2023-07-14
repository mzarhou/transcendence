import { useToast } from "@/components/ui/use-toast";
import { SignInType } from "@transcendence/common";
import axios, { AxiosError } from "axios";
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
        router.replace("/");
      },
      onError: (error) => {
        let message = "Failed to sign in";
        if (error instanceof AxiosError) {
          message = error.response?.data;
        }
        toast({
          description: message,
          variant: "destructive",
        });
      },
    }
  );
  return { signin: trigger, ...rest };
};
