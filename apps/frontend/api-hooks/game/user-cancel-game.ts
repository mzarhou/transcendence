import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { getServerMessage } from "@/lib/utils";

export const useCancelGame = (matchId: number) => {
  const { toast } = useToast();

  return useSWRMutation(
    `/games/${matchId}/cancel`,
    async (url) => api.post(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to cancel this game"),
          variant: "destructive",
        });
      },
    }
  );
};
