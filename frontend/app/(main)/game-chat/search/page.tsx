"use client";

import { useSearchUsers } from "@/api-hooks/use-search-users";
import { Input } from "@/components/ui/input";
import SearchFriendItem from "../components/search-friend-item";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import GoBackBtn from "../components/chat-go-back";

export default function ChatSearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data } = useSearchUsers(debouncedQuery);

  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Search for new friends</h3>
      </GoBackBtn>
      <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8 md:p-4 md:px-6 md:pt-0">
        <Input
          autoFocus
          id="search-users"
          placeholder="Search @username, groups"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="h-full space-y-4 overflow-y-auto pr-2">
          {data?.length ? (
            data.map((u) => <SearchFriendItem key={u.id} user={u} />)
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-chat-foreground/30">
              No user found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
