import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { useUpdateProfile } from "./use-update-profile";
import { useToast } from "@/components/ui/use-toast";
import { getServerMessage } from "@/lib/utils";
import { useUser } from "@/context/user-context";

export const useUploadProfileImage = () => {
  const { toast } = useToast();
  const { trigger: updateProfile } = useUpdateProfile();
  const { refresh: refreshUser } = useUser();

  return useSWRMutation(
    `/uploads/image`,
    async (url, { arg }: { arg: FormData }) => {
      const { data } = await api.post(url, arg);
      const imageUrl = z.string().url().parse(data.imageUrl);
      return updateProfile({ avatar: imageUrl });
    },
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
