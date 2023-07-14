import { useSWRConfig } from "swr";

let inputEl: HTMLInputElement | null = null;

export function useRevalidateSearch() {
  const { mutate } = useSWRConfig();
  const revalidateSearch = () => {
    if (!inputEl)
      inputEl = document.querySelector<HTMLInputElement>("#search-users");
    if (!inputEl) return;
    mutate([`/chat/search`, inputEl.value]);
  };
  return { revalidateSearch };
}
