"use client";

import { GroupType, useGroup } from "@/api-hooks/use-group";
import GoBackBtn from "../../../components/chat-go-back";
import FullLoader from "@/components/ui/full-loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user-context";

type ManageGroupPageProps = {
  params: {
    groupId: string;
  };
};
export default function ManageGroupPage({
  params: { groupId },
}: ManageGroupPageProps) {
  const router = useRouter();
  const { data: group, isLoading } = useGroup(groupId);

  useEffect(() => {
    if (group && group.role === "MEMBER") router.replace("/game-chat");
  }, [router, group]);

  return (
    <>
      <GoBackBtn>
        <h3>Manage group</h3>
      </GoBackBtn>
      <div className="mt-4 flex h-0 w-full flex-grow flex-col overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
        {isLoading ? (
          <FullLoader />
        ) : (
          group && <ManageGroupPageBody group={group} />
        )}
      </div>
    </>
  );
}

function ManageGroupPageBody({ group }: { group: GroupType }) {
  const [query, setQuery] = useState("");
  const { user } = useUser();

  const users =
    query.length === 0
      ? group.users
      : group.users.filter((u) =>
          u.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <Input
        placeholder="search for a user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-8 space-y-2">
        {users.length ? (
          users.map((u) => (
            <div key={u.id} className="flex space-x-2">
              <img src={u.avatar} className="h-12 w-12 rounded-full" />
              <div className="flex flex-grow justify-between border-b">
                <p>~{u.name}</p>
                <div className="mt-1 flex text-card-foreground/50">
                  <p className="text-xs">{u.role}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreVertical className="h-5 w-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {group.ownerId === user?.id && (
                        <DropdownMenuItem className="cursor-pointer">
                          Set as admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer">
                        Kick
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Mute
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Ban
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No user found</div>
        )}
      </div>
    </div>
  );
}
