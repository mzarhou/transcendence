import { api } from "@/lib/api";
import { SearchType, SearchUser } from "@transcendence/common";
import { AxiosError } from "axios";
import useSWRMutation from "swr/mutation";

export const useSearchUsers = () => {
  const { trigger, ...rest } = useSWRMutation(
    `/chat/search`,
    async (url, { arg }: { arg: SearchType }) => {
      const { data } = await api.post<SearchUser[]>(url, arg).catch((err) => {
        if (err instanceof AxiosError) {
          throw err.message;
        }
        throw "Unkown error";
      });
      return data;
    }
  );
  return { trigger: (arg: SearchType) => trigger(arg).catch(), ...rest };
};
