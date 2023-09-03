"use client";

import { useGroup } from "@/api-hooks/groups/use-group";
import GoBackBtn from "../../../components/chat-go-back";
import FullLoader from "@/components/ui/full-loader";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { SlidersHorizontal, Users } from "lucide-react";
import { useUser } from "@/context/user-context";
import { truncateText } from "@/lib/utils";
import { InviteUserAction } from "./components/invite-user-action";
import { ActionLink } from "./components/action-link";

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
function GroupInfoBody({ groupId }: GroupInfoBodyProps) {
  const { user } = useUser();
  const { data: group, isLoading, error } = useGroup(groupId);
  if (isLoading) return <FullLoader />;

  return group ? (
    <div className="mt-4 flex h-0 w-full flex-grow flex-col overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
      <div className="flex flex-col items-center space-y-1">
        <div className="mx-auto h-20 w-20 rounded-full bg-input-placeholder/30">
          <img src={group.avatar} className="rounded-full" />
        </div>
        <h4 className="mx-auto" title={group.name}>
          {truncateText(group?.name ?? "", 20)}
        </h4>
        <p className="mx-auto text-sm text-card-foreground/60">
          {group.status}
        </p>
      </div>
      {group.role === "ADMIN" && (
        <div className="mt-4 flex justify-center space-x-8">
          <InviteUserAction group={group} />
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
              <p className="mt-1 text-xs text-card-foreground/50">
                {group.ownerId === u.id ? "OWNER" : u.role}
              </p>
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
