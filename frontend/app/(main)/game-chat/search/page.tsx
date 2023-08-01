"use client";

import { useSearchUsers } from "@/api-hooks/use-search-users";
import { Input } from "@/components/ui/input";
import SearchFriendItem from "../components/search-friend-item";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import GoBackBtn from "../components/chat-go-back";
import { useSearchGroups } from "@/api-hooks/use-search-groups";
import SearchGroupItem from "./components/search-group-item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { Loader2 } from "lucide-react";

type SearchForType = "users" | "groups";

export default function ChatSearchPage() {
  const [query, setQuery] = useState("");
  const [searchFor, setSearchFor] = useState<SearchForType>("users");
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Search for new friends</h3>
      </GoBackBtn>
      <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8 md:p-4 md:px-6 md:pt-0">
        <div className="flex space-x-4">
          <Input
            autoFocus
            id="search-users"
            placeholder="Search @username, groups"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            // defaultValue={searchFor}
            value={searchFor}
            onValueChange={(v) => setSearchFor(v as SearchForType)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Search for" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Search For</SelectLabel>
                <SelectItem value={"users" satisfies SearchForType}>
                  Users
                </SelectItem>
                <SelectItem value={"groups" satisfies SearchForType}>
                  Groups
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="h-full space-y-4 overflow-y-auto pr-2">
          {searchFor === "users" ? (
            <SearchUsers query={debouncedQuery} />
          ) : (
            <SearchGroups query={debouncedQuery} />
          )}
        </div>
      </div>
    </>
  );
}

type SearchUsersProps = {
  query: string;
};
function SearchUsers({ query }: SearchUsersProps) {
  const { data: users, isLoading } = useSearchUsers(query);

  if (isLoading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <>
      {users?.length ? (
        users.map((u) => <SearchFriendItem key={u.id} user={u} />)
      ) : (
        <div className="flex h-full items-center justify-center text-2xl text-chat-foreground/30">
          No user found
        </div>
      )}
    </>
  );
}

type SearchGroupsProps = {
  query: string;
};
function SearchGroups({ query }: SearchGroupsProps) {
  const { data: groups, isLoading } = useSearchGroups(query);

  if (isLoading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <>
      {groups?.length ? (
        groups.map((g) => <SearchGroupItem key={g.id} group={g} />)
      ) : (
        <div className="flex h-full items-center justify-center text-2xl text-chat-foreground/30">
          No group found
        </div>
      )}
    </>
  );
}
