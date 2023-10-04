import { useToast } from "@/components/ui/use-toast";
import { USER_KEY } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { SignInType } from "@transcendence/db";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useSignOut = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const { trigger, ...rest } = useSWRMutation(
    "/authentication/sign-out",
    (url) => api.post(url),
    {
      onSuccess: async () => {
        router.replace("/login");
        mutate(USER_KEY);
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to sign out"),
          variant: "destructive",
        });
      },
    }
  );
  return { signout: () => trigger().catch((_e) => {}), ...rest };
};
