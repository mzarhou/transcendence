"use client";

import { useSearchUsers } from "@/api-hooks/use-search-users";
import { Input } from "@/components/ui/input";
import SearchFriendItem from "./components/search-friend-item";
import { debounce } from "@/lib/utils";
import { useAutoFocus } from "@/hooks/use-auto-focus";

export default function ChatSearchPage() {
  const { data, trigger } = useSearchUsers();
  const search = debounce(trigger, 300);
  const inputRef = useAutoFocus();

  return (
    <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8 md:p-4 md:px-6 md:pt-0">
      <Input
        ref={inputRef}
        placeholder="Search @username, groups"
        onInput={(e) => {
          const { value } = e.target as EventTarget & { value: string };
          search({ term: value });
        }}
      />
      <div className="h-full space-y-4 overflow-y-auto pr-2">
        {data ? (
          data.map((u) => <SearchFriendItem key={u.id} user={u} />)
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-chat-foreground/30">
            No user found
          </div>
        )}
      </div>
    </div>
  );
}
