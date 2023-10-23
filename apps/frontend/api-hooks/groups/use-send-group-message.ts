import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { SendGroupMessageType } from "@transcendence/db";
import { useToast } from "@/components/ui/use-toast";
import { getServerMessage } from "@/lib/utils";

export const useSendGroupMessage = () => {
  const { toast } = useToast();

  return useSWRMutation(
    `/groups/send-message`,
    async (url, { arg }: { arg: SendGroupMessageType }) => api.post(url, arg),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to send message"),
          variant: "destructive",
        });
      },
    }
  );
};
