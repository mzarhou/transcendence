"use client";

import FullLoader from "@/components/ui/full-loader";
import GoBackBtn from "../components/chat-go-back";
import { useGroupInvitations } from "@/api-hooks/groups/use-group-invitations";
import { GroupInvitationItem } from "../components/group-invitation-item";

export default function GroupInvitationsPage() {
  const { data, isLoading } = useGroupInvitations();
  if (isLoading) return <FullLoader />;

  const invitationsCount = data?.length ?? 0;
  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Group Invitations</h3>
      </GoBackBtn>
      <div className="flex h-0 flex-grow flex-col pt-8 md:px-4 md:pt-0">
        {invitationsCount ? (
          <div className="mt-5 flex-grow space-y-8 overflow-y-scroll pb-4">
            {data!.map((invitation) => (
              <GroupInvitationItem
                key={invitation.id}
                invitation={invitation}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-grow items-center justify-center text-lg text-chat-card-foreground/40">
            No invitation found
          </div>
        )}
      </div>
    </>
  );
}
