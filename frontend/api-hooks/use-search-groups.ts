import { api } from "@/lib/api";
import { SearchGroup } from "@transcendence/common";
import { AxiosError } from "axios";
import useSWR from "swr";

export const searchGroupsKey = "/groups/search";

export const useSearchGroups = (query: string) => {
  return useSWR([searchGroupsKey, query], async ([url, query]) => {
    const { data } = await api
      .get<SearchGroup[]>(url + `?term=${query}`)
      .catch((err) => {
        if (err instanceof AxiosError) {
          throw err.message;
        }
        throw "Unkown error";
      });
    return data;
  });
};
