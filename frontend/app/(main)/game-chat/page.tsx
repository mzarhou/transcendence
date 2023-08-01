"use client";

import { Loader2, MoreVertical } from "lucide-react";
import FriendItem from "./components/friend-item";
import FakeChatSearch from "./components/fake-chat-search";
import { useFriends } from "@/api-hooks/use-friends";
import Link from "next/link";
import FriendRequestsLink from "./components/friend-requests-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Game() {
  const { data: friends, isLoading } = useFriends();

  return (
    <div className="mt-9 flex h-0 flex-grow flex-col space-y-10 p-4">
      <FakeChatSearch />
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-sm">Your groups</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="h-6 w-6 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
                <Link href="/game-chat/groups/create">Create Group</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <MoreVertical className="h-5 w-5" /> */}
        </div>
        <div className="mt-4 flex space-x-4 overflow-x-auto">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <GroupItem key={index} />
            ))}
        </div>
      </div>
      <div className="flex h-0 flex-grow flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm">Friends</h3>
          <div className="flex items-center space-x-1">
            <FriendRequestsLink />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="h-6 w-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer hover:bg-chat/90">
                  <Link href="/game-chat/blocked-users">Blocked Users</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="h-0 flex-grow space-y-4 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="h-full pt-4 text-chat-foreground/30">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
          ) : friends && friends.length ? (
            friends.map((frd) => (
              <Link key={frd.id} href={`/game-chat/${frd.id}`}>
                <FriendItem friend={frd} />
              </Link>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-chat-foreground/30">
              No friend found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupItem() {
  return (
    <div className="relative aspect-square h-20 rounded-full bg-gray-200"></div>
  );
}
