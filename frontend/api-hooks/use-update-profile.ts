import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { UpdateUserType } from "@transcendence/common";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useUpdateProfile = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { user } = useUser();

  const { trigger, ...rest } = useSWRMutation(
    `/users/me`,
    async (url, { arg }: { arg: UpdateUserType }) => {
      if (!user) return;
      return api.patch(url, arg).catch((err) => {
        if (err instanceof AxiosError) {
          throw err.message;
        }
        throw "Unkown error";
      });
    },
    {
      onSuccess: () => {
        toast({
          description: "Profile Updated",
          className: "bg-green-200",
        });
        mutate("/users/me");
      },
      onError: (_error) => {
        toast({
          description: "Failed to update profile",
          className: "bg-red-200",
        });
      },
    }
  );
  return { trigger: (arg: UpdateUserType) => trigger(arg).catch(), ...rest };
};
