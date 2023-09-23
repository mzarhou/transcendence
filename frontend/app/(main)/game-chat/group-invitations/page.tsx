"use client";

import FullLoader from "@/components/ui/full-loader";
import GoBackBtn from "../components/chat-go-back";
import { useGroupInvitations } from "@/api-hooks/groups/use-group-invitations";

export default function GroupInvitationsPage() {
  const { data, isLoading } = useGroupInvitations();
  if (isLoading) return <FullLoader />;

  const invitationsCount = data?.length ?? 0;
  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Group Invitations</h3>
      </GoBackBtn>
      <div className="flex-grow pt-8 md:px-6 md:pt-0">
        <div className="mt-5 h-full space-y-8">
          {invitationsCount > 0 ? (
            data!.map((invitation) => <div>{invitation.group.name}</div>)
          ) : (
            <div className="flex h-full flex-grow items-center justify-center text-lg text-chat-card-foreground/40">
              No invitation found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
