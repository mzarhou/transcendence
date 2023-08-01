import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { CreateGroupType } from "@transcendence/common";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

export const useCreateGroup = () => {
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useSWRMutation(
    `/groups`,
    async (url, { arg }: { arg: CreateGroupType }) => {
      return api.post(url, arg);
    },
    {
      onSuccess: () => {
        toast({ description: "Group created" });
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
