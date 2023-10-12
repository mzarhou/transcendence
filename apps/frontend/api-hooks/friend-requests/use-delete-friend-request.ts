import { useToast } from "@/components/ui/use-toast";
import { useRevalidateUsersSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useDeleteFriendRequest = (friendRequestId: number) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { revalidateSearch } = useRevalidateUsersSearch();

  const { trigger, ...rest } = useSWRMutation(
    `/chat/friend-request/${friendRequestId}`,
    async (url) => api.delete(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(
            error,
            "Failed to delete friend request"
          ),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Friend request deleted" });
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
