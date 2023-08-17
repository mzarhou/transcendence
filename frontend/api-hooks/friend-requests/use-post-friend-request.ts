import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { CreateFriendRequestType } from "@transcendence/common";
import { AxiosError } from "axios";
// import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useRevalidateUsersSearch } from "@/hooks/use-revalidate-search";
import { getServerMessage } from "@/lib/utils";

export const usePostFriendRequest = () => {
  const { toast } = useToast();
  const { revalidateSearch } = useRevalidateUsersSearch();

  const { trigger, ...rest } = useSWRMutation(
    "/chat/friend-request",
    async (url, { arg }: { arg: CreateFriendRequestType }) => {
      return api.post(url, arg);
    },
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to send friend request"),
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
