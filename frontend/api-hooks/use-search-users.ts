import { api } from "@/lib/api";
import { SearchUser } from "@transcendence/common";
import { AxiosError } from "axios";
import useSWR from "swr";

export const useSearchUsers = (query: string) => {
  return useSWR([`/chat/search`, query], async ([url, query]) => {
    const { data } = await api
      .get<SearchUser[]>(url + `?term=${query}`)
      .catch((err) => {
        if (err instanceof AxiosError) {
          throw err.message;
        }
        throw "Unkown error";
      });
    return data;
  });
};
