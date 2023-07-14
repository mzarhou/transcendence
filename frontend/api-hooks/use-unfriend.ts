import { useToast } from "@/components/ui/use-toast";
import { useRevalidateSearch } from "@/hooks/use-revalidate-search";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

type useUnfriendProps = {
  targetUserId: number;
};
export const useUnfriend = ({ targetUserId }: useUnfriendProps) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { revalidateSearch } = useRevalidateSearch();

  const { trigger, ...rest } = useSWRMutation(
    `chat/unfriend/${targetUserId}`,
    async (url) => api.post(url),
    {
      onError: (_error) => {
        toast({
          description: "Request failed",
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
