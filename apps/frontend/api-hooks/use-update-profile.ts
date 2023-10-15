import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { UpdateUserType } from "@transcendence/db";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";
import { useUser } from "@/context/user-context";

export const useUpdateProfile = () => {
  const { toast } = useToast();
  const { refresh: refreshUser } = useUser();

  return useSWRMutation(
    `/users/me`,
    async (url, { arg }: { arg: UpdateUserType }) => api.patch(url, arg),
    {
      onSuccess: () => {
        toast({ description: "Profile Updated" });
        refreshUser();
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to update profile"),
          variant: "destructive",
        });
      },
    }
  );
};
