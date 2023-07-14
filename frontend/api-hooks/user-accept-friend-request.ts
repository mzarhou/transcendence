import { useToast } from "@/components/ui/use-toast";
import { useRevalidateSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useAcceptFriendRequest = (friendRequestId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { revalidateSearch } = useRevalidateSearch();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/friend-request/${friendRequestId}/accept`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        let message = "Failed to accept friend request";
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
          description: "Friend request accepted",
          className: "bg-green-200",
        });
        mutate("/chat/friends");
        mutate("/chat/friend-request/received");
        revalidateSearch();
      },
    }
  );

  return {
    trigger: () => trigger().catch((_e) => {}),
    ...rest,
  };
};
