import { useToast } from "@/components/ui/use-toast";
import { useRevalidateUsersSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useAcceptFriendRequest = (friendRequestId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { revalidateSearch } = useRevalidateUsersSearch();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/friend-request/${friendRequestId}/accept`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(
            error,
            "Failed to accept friend request"
          ),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Friend request accepted" });
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
