"use client";

import { useGroup } from "@/api-hooks/use-group";
import GoBackBtn from "../../../components/chat-go-back";
import FullLoader from "@/components/ui/full-loader";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { SlidersHorizontal, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { useUser } from "@/context/user-context";

type GroupInfoPageProps = {
  params: {
    groupId: string;
  };
};
export default function GroupInfoPage({
  params: { groupId },
}: GroupInfoPageProps) {
  return (
    <>
      <GoBackBtn>
        <h3>Group settings</h3>
      </GoBackBtn>
      <GroupInfoBody groupId={groupId} />
    </>
  );
}

type GroupInfoBodyProps = {
  groupId: string;
};
export function GroupInfoBody({ groupId }: GroupInfoBodyProps) {
  const { user } = useUser();
  const { data: group, isLoading, error } = useGroup(groupId);
  if (isLoading) return <FullLoader />;

  return group ? (
    <div className="mt-4 flex h-0 w-full flex-grow flex-col overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
      <div className="flex flex-col items-center space-y-1">
        <div className="mx-auto h-20 w-20 rounded-full bg-input-placeholder/30">
          <img src={group.avatar} className="rounded-full" />
        </div>
        <h4 className="mx-auto">{group.name}</h4>
      </div>
      {group.role === "ADMIN" && (
        <div className="mt-4 flex justify-center space-x-8">
          <ActionLink text="Add User" href="#">
            <UserPlus className="w-5" />
          </ActionLink>
          {user?.id && group.ownerId === user.id && (
            <ActionLink text="Settings" href="settings">
              <SlidersHorizontal className="w-5" />
            </ActionLink>
          )}
          <ActionLink text="Users" href="manage">
            <Users className="w-5" />
          </ActionLink>
        </div>
      )}
      <p className="mt-8 text-sm text-card-foreground/80">Members:</p>
      <div className="mt-4 space-y-4">
        {group.users.map((u) => (
          <div key={u.id} className="flex space-x-2">
            <img src={u.avatar} className="h-12 w-12 rounded-full" />
            <div className="flex flex-grow justify-between border-b">
              <p className="">~{u.name}</p>
              <p className="mt-1 text-xs text-card-foreground/50">{u.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <FullPlaceHolder
      text={error ? "Failed getting group details" : "Group not found"}
    />
  );
}

type ActionLinkProps = {
  text: string;
  href: string;
  children: ReactNode;
};
export function ActionLink(props: ActionLinkProps) {
  return (
    <Link
      href={props.href}
      className="flex cursor-pointer flex-col items-center space-y-1"
    >
      <div className="flex aspect-square h-14 items-center justify-center rounded-full border px-0 py-0">
        {props.children}
      </div>
      <span className="text-sm">{props.text}</span>
    </Link>
  );
}
