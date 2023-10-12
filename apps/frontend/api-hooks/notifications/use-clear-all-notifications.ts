import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { notificationsKey } from "./use-notifications";
import { getServerMessage } from "@/lib/utils";

export const useClearAllNotifications = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/notifications/clear-all",
    async (url) => api.delete(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(
            error,
            "Failed to clear all notifications"
          ),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        mutate(notificationsKey, [], { revalidate: false });
      },
    }
  );

  return {
    ...rest,
    trigger: () => trigger().catch((_err) => {}),
  };
};
