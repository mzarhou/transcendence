"use client";

import { useGroupInvitations } from "@/api-hooks/groups/use-group-invitations";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function GroupInvitationsLink() {
  const { data, isLoading } = useGroupInvitations();

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  const invitationsCount = data?.length ?? 0;
  return (
    <Link
      href="/game-chat/group-invitations"
      className="relative"
      title="Group Invitations"
    >
      <Users />
      {invitationsCount !== 0 && (
        <div className="absolute -left-2 top-2 aspect-square w-[18px] rounded-full bg-red-500 text-center text-xs text-white">
          {invitationsCount > 9 ? "9+" : invitationsCount}
        </div>
      )}
    </Link>
  );
}
