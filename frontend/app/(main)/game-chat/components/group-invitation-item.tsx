"use client";

import { Check, X } from "lucide-react";
import { UserGroupInvitation } from "@transcendence/common";
import { LoaderButton } from "@/components/ui/loader-button";
import { useRemoveGroupInvitation } from "@/api-hooks/groups/use-remove-group-invitation";

type GroupInvitationItemProps = {
  invitation: UserGroupInvitation;
};
export function GroupInvitationItem({ invitation }: GroupInvitationItemProps) {
  const { trigger, isMutating } = useRemoveGroupInvitation(invitation.id);

  const removeGroupInvitation = async () => {
    try {
      await trigger();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="flex space-x-4">
      <img src={invitation.group.avatar} className="w-20 rounded-full" />
      <div className="flex flex-grow flex-col justify-between space-x-2 pb-1">
        <h4>{invitation.group.name}</h4>
        <div className="flex justify-end space-x-2">
          <LoaderButton
            isLoading={isMutating}
            onClick={() => removeGroupInvitation()}
          >
            <X />
          </LoaderButton>
          <LoaderButton>
            <Check />
          </LoaderButton>
        </div>
      </div>
    </div>
  );
}
