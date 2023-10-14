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
import { useGroups } from "@/api-hooks/groups/use-groups";
import { GroupWithRole } from "@transcendence/db";
import FullLoader from "@/components/ui/full-loader";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateText } from "@/lib/utils";
import GroupInvitationsLink from "./components/group-invitations-link";

export default function Game() {
  const { data: friends, isLoading } = useFriends();

  return (
    <div className="mt-9 flex h-0 flex-grow flex-col space-y-10 overflow-y-auto p-4">
      <FakeChatSearch />

      {/* Groups */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-sm">Your groups</h3>
          <div className="flex items-center space-x-1">
            <GroupInvitationsLink />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="h-6 w-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/game-chat/groups/create">Create Group</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Groups />
      </div>

      {/* Friend */}
      <div className="flex  h-0 min-h-[120px] flex-grow flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm">Friends</h3>
          <div className="flex items-center space-x-1">
            <FriendRequestsLink />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="h-6 w-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/game-chat/blocked-users">Blocked Users</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="h-0 flex-grow space-y-4 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="h-full pt-4 text-card-foreground/50">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
          ) : friends && friends.length ? (
            friends.map((frd) => <FriendItem key={frd.id} friend={frd} />)
          ) : (
            <FullPlaceHolder text="No friend found" className="text-xl" />
          )}
        </div>
      </div>
    </div>
  );
}

type GroupItemProps = {
  group: GroupWithRole;
};
function GroupItem({
  group: { id, avatar, name, role, status },
}: GroupItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex aspect-square w-20 min-w-[80px] flex-col items-center space-y-2">
            <Link href={`/game-chat/groups/${id}`}>
              <img
                className="h-20 min-h-[80px] w-20 min-w-[80px] rounded-full"
                src={avatar}
              />
            </Link>
            <p className="mx-auto text-sm">{truncateText(name, 8)}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <h4 className="mx-auto border-b pb-1 text-lg">{name}</h4>
          <div className="mt-1 space-y-2 py-4">
            <p className="font-semibold">{status}</p>
            <p>
              role: <span className="font-semibold">{role}</span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Groups() {
  const { data: groups, isLoading } = useGroups();

  if (isLoading) return <FullLoader />;
  if (groups.length === 0)
    return (
      <FullPlaceHolder
        text="Unite with others. Explore group possibilities now! "
        className="text-center text-card-foreground/40"
      />
    );
  return (
    <div className="mt-4 flex space-x-4 overflow-x-auto">
      {groups.map((g) => (
        <GroupItem key={g.id} group={g} />
      ))}
    </div>
  );
}
