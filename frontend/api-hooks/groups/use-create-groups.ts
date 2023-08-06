import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { CreateGroupType } from "@transcendence/common";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { groupsKey } from "./use-groups";

export const useCreateGroup = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const mutation = useSWRMutation(
    `/groups`,
    async (url, { arg }: { arg: CreateGroupType }) => {
      return api.post(url, arg);
    },
    {
      onSuccess: () => {
        toast({ description: "Group created" });
        mutate(groupsKey);
        router.push("/game-chat");
      },
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to create the group"),
          variant: "destructive",
        });
      },
    }
  );
  return {
    ...mutation,
    trigger: (arg: CreateGroupType) => mutation.trigger(arg).catch((_e) => {}),
  };
};
