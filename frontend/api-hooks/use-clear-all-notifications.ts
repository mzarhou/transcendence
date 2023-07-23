import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { notificationsKey } from "./use-notifications";

export const useClearAllNotifications = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/notifications",
    async (url) => api.delete(url),
    {
      onError: (_error) => {
        toast({
          description: "Failed to clear all notifications",
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
