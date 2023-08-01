import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { notificationsKey } from "./use-notifications";
import { getServerMessage } from "@/lib/utils";

export const useReadAllNotifications = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/notifications/read-all",
    async (url) => api.patch(url),
    {
      onError: (error) => {
        toast({
          description: getServerMessage(
            error,
            "Failed to read all notifications"
          ),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        mutate(notificationsKey);
      },
    }
  );

  return {
    ...rest,
    trigger: () => trigger().catch((_err) => {}),
  };
};
