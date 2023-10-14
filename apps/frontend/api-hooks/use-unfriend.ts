import { useToast } from "@/components/ui/use-toast";
import { useRevalidateUsersSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

type useUnfriendProps = {
  targetUserId: number;
};
export const useUnfriend = ({ targetUserId }: useUnfriendProps) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { revalidateSearch } = useRevalidateUsersSearch();

  const { trigger, ...rest } = useSWRMutation(
    `chat/unfriend/${targetUserId}`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Unfriend request failed"),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "unfriended successfully" });
        mutate("/chat/friends");
        revalidateSearch();
      },
    }
  );

  return {
    trigger: () => trigger().catch((_e) => {}),
    ...rest,
  };
};
