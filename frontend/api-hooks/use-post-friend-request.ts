import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { CreateFriendRequestType } from "@transcendence/common";
import { AxiosError } from "axios";
// import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useRevalidateSearch } from "@/hooks/use-revalidate-search";

export const usePostFriendRequest = () => {
  const { toast } = useToast();
  const { revalidateSearch } = useRevalidateSearch();

  const { trigger, ...rest } = useSWRMutation(
    "/chat/friend-request",
    async (url, { arg }: { arg: CreateFriendRequestType }) => {
      return api.post(url, arg);
    },
    {
      onError: (error) => {
        let message = "Failed to send friend request";
        if (error instanceof AxiosError) {
          message = error.message;
        }
        toast({
          description: message,
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Friend request sent" });
        revalidateSearch();
      },
    }
  );

  return {
    trigger: (arg: CreateFriendRequestType) => trigger(arg).catch((_e) => {}),
    ...rest,
  };
};
