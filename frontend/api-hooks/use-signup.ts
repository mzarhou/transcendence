import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { SignUpType } from "@transcendence/common";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

export const useSignUp = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { trigger, ...rest } = useSWRMutation(
    `/authentication/sign-up`,
    async (url, { arg }: { arg: SignUpType }) => {
      return api.post(url, arg);
    },
    {
      onSuccess: () => {
        toast({
          description: "Account Created successfully",
          className: "bg-green-200",
        });
        router.replace("/login");
      },
      onError: (_error) => {
        toast({
          description: "Failed to signup",
          className: "bg-red-200",
        });
      },
    }
  );
  return { signup: (arg: SignUpType) => trigger(arg), ...rest };
};
