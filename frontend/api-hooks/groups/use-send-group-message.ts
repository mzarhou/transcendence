import { api } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { SendGroupMessageType } from "@transcendence/common";

export const useSendGroupMessage = () => {
  return useSWRMutation(
    `/groups/send-message`,
    async (url, { arg }: { arg: SendGroupMessageType }) => api.post(url, arg),
  );
};
