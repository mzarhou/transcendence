import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { UpdateUserType } from "@transcendence/common";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";

export const useUpdateProfile = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const { trigger, ...rest } = useSWRMutation(
    `/users/me`,
    async (url, { arg }: { arg: UpdateUserType }) => api.patch(url, arg),
    {
      onSuccess: () => {
        toast({ description: "Profile Updated" });
        mutate("/users/me");
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to update profile"),
          variant: "destructive",
        });
      },
    }
  );
  return { trigger: (arg: UpdateUserType) => trigger(arg).catch(), ...rest };
};
