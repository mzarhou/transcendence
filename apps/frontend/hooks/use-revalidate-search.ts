import { searchGroupsKey } from "@/api-hooks/groups/use-search-groups";
import { searchUsersKey } from "@/api-hooks/use-search-users";
import { useSWRConfig } from "swr";

let inputEl: HTMLInputElement | null = null;

export function useRevalidateUsersSearch() {
  const { mutate } = useSWRConfig();
  const revalidateSearch = () => {
    if (!inputEl)
      inputEl = document.querySelector<HTMLInputElement>("#search-users");
    if (!inputEl) return;
    mutate([searchUsersKey, inputEl.value]);
  };
  return { revalidateSearch };
}

export function useRevalidateGroupsSearch() {
  const { mutate } = useSWRConfig();
  const revalidateGroupsSearch = () => {
    if (!inputEl)
      inputEl = document.querySelector<HTMLInputElement>("#search-users");
    if (!inputEl) return;
    mutate([searchGroupsKey, inputEl.value]);
  };
  return { revalidateGroupsSearch };
}
