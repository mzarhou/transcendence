"use client";

import { Check, X } from "lucide-react";
import { UserGroupInvitation } from "@transcendence/db";
import { LoaderButton } from "@/components/ui/loader-button";
import { useRemoveGroupInvitation } from "@/api-hooks/groups/use-remove-group-invitation";
import { useAcceptGroupInvitation } from "@/api-hooks/groups/use-accept-group-invitation";

type GroupInvitationItemProps = {
  invitation: UserGroupInvitation;
};
export function GroupInvitationItem({ invitation }: GroupInvitationItemProps) {
  const { trigger: refuse, isMutating: isRefusing } = useRemoveGroupInvitation(
    invitation.id
  );
  const { trigger: accept, isMutating: isAccepting } = useAcceptGroupInvitation(
    invitation.id.toString()
  );

  const removeGroupInvitation = async () => {
    try {
      await refuse();
    } catch (error) {}
  };

  const acceptInvitation = async () => {
    try {
      await accept();
    } catch (error) {}
  };

  return (
    <div className="flex space-x-4">
      <img src={invitation.group.avatar} className="w-20 rounded-full" />
      <div className="flex flex-grow flex-col justify-between space-x-2 pb-1">
        <h4>{invitation.group.name}</h4>
        <div className="flex justify-end space-x-2">
          <LoaderButton
            isLoading={isRefusing}
            onClick={() => removeGroupInvitation()}
            disabled={isRefusing || isAccepting}
          >
            <X />
          </LoaderButton>
          <LoaderButton
            isLoading={isAccepting}
            onClick={() => acceptInvitation()}
            disabled={isRefusing || isAccepting}
          >
            <Check />
          </LoaderButton>
        </div>
      </div>
    </div>
  );
}
