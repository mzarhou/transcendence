"use client";
import { GroupType, useGroup } from "@/api-hooks/groups/use-group";
import { GroupIdProps } from "../../../group.types";
import { useUser } from "@/context/user-context";
import { queryAtom } from "../search-query-atom";
import { useAtom } from "jotai";
import { UserGroupRole } from "@transcendence/db";
import { UserGroup } from "@transcendence/db";
import { MoreVertical } from "lucide-react";
import SetAdminAsMember from "./components/set-admin-as-member-action";
import SetUserAsAdmin from "./components/set-user-as-admin";
import KickUser from "./components/kick-user-action";
import BanUser from "./components/ban-user-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import MuteUser from "./components/mute-user";

export default function Members({ group }: { group: GroupType }) {
  const { user: currentUser } = useUser();
  const [query] = useAtom(queryAtom);

  const filterUsers = (targetRole: UserGroupRole) => {
    return (
      group.users.filter((u) => {
        if (u.id === currentUser?.id) return false;
        if (query.length > 0) {
          return u.role === targetRole && u.name.toLowerCase().includes(query);
        }
        return u.role === targetRole;
      }) ?? []
    );
  };

  const admins = filterUsers("ADMIN");
  const members = filterUsers("MEMBER");
  const users = [...admins, ...members];

  return (
    <div className="mt-8 h-full min-h-full space-y-2">
      {users.length ? (
        users.map((u) => (
          <div key={u.id} className="flex space-x-2">
            <img src={u.avatar} className="h-12 w-12 rounded-full" />
            <div className="flex flex-grow justify-between border-b">
              <p>~{u.name}</p>
              <div className="mt-1 flex text-card-foreground/50">
                <p className="text-xs">{u.role}</p>
                {group && <Actions targetUser={u} group={group} />}
              </div>
            </div>
          </div>
        ))
      ) : (
        <FullPlaceHolder text="No user found" />
      )}
    </div>
  );
}

type ActionsProps = { targetUser: UserGroup; group: GroupType };
function Actions({ targetUser, group }: ActionsProps) {
  const { user: currentUser } = useUser();

  if (!currentUser) return <></>;

  const isCurrentUserOwner = currentUser.id === group.ownerId;

  if (
    targetUser.id === group.ownerId ||
    (!isCurrentUserOwner && targetUser.role === "ADMIN")
  ) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="h-5 w-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isCurrentUserOwner &&
          (targetUser.role === "ADMIN" ? (
            <SetAdminAsMember user={targetUser} groupId={group.id} />
          ) : (
            <SetUserAsAdmin user={targetUser} groupId={group.id} />
          ))}
        <KickUser user={targetUser} groupId={group.id} />
        <BanUser user={targetUser} groupId={group.id} />
        <MuteUser user={targetUser} groupId={group.id} />
        {/* TODO: add mute action */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
