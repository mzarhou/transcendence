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
          className: "bg-red-200",
        });
      },
      onSuccess: () => {
        toast({
          description: "unfriended successfully",
          className: "bg-green-200",
        });
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
