import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { CreateFriendRequestType } from "@transcendence/common";
import { AxiosError } from "axios";
// import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const usePostFriendRequest = () => {
  const { toast } = useToast();
  // const { mutate } = useSWRConfig();
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
          className: "bg-red-200 text-red-900",
        });
      },
      onSuccess: () => {
        toast({
          description: "friend request sent",
          className: "bg-green-200",
        });
      },
    }
  );

  return {
    trigger: (arg: CreateFriendRequestType) => trigger(arg).catch((_e) => {}),
    ...rest,
  };
};
