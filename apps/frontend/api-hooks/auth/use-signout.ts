import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/context";
import { useUser } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

export const useSignOut = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { refresh } = useUser();
  const socket = useSocket();

  const { trigger, ...rest } = useSWRMutation(
    "/authentication/sign-out",
    (url) => api.post(url),
    {
      onSuccess: async () => {
        socket?.disconnect();
        await refresh();
        router.replace("/login");
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
