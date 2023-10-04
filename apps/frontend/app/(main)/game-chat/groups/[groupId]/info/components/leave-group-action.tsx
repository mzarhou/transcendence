"use client";

import { GroupType } from "@/api-hooks/groups/use-group";
import ConfirmDialog from "@/components/confirm-dialog";
import { LogOut } from "lucide-react";
import { ActionLink } from "./action-link";
import { Button } from "@/components/ui/button";
import { useLeaveGroup } from "@/api-hooks/groups/use-leave-group";
import { useOwnerLeaveGroup } from "@/api-hooks/groups/use-owner-leave-group";
import { useUser } from "@/context/user-context";
import { useGroupUsers } from "@/api-hooks/groups/use-group-users";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { LoaderButton } from "@/components/ui/loader-button";

export function LeaveGroupAction({
  className,
  group,
}: {
  group: GroupType;
  className?: string;
}) {
  const { trigger: leave, isMutating } = useLeaveGroup(group.id.toString());
  const { trigger: ownerLeave, isMutating: isMutatingOwner } =
    useOwnerLeaveGroup(group.id.toString());
  const { data: memebers } = useGroupUsers({
    groupId: group.id.toString(),
    filter: "members",
  });
  const { user } = useUser();

  const [newOwnerId, setNewOwnerId] = useState<string | null>(null);
  const newOwner = memebers?.find((m) => "" + m.id === newOwnerId);

  const isOwnerLeaving = user && group.ownerId === user.id;

  const leaveGroup = async (close: () => void) => {
    if (newOwnerId === null && isOwnerLeaving) return;
    try {
      if (isOwnerLeaving) {
        await ownerLeave({ newOwnerId: parseInt(newOwnerId!) });
      } else {
        await leave();
      }
      close();
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <ConfirmDialog
      trigger={
        <ActionLink
          text="Leave group"
          href="#"
          onClick={(e) => e.preventDefault()}
          className={className}
        >
          <LogOut className="w-5" />
        </ActionLink>
      }
    >
      {({ close }) => (
        <div className="flex flex-col space-y-8 max-h-[90vh]">
          <p>Are you sure you want to leave group ?</p>
          {isOwnerLeaving && (
            <div className="space-y-4 flex-grow flex flex-col overflow-y-auto">
              <div className="py-1">
                <label className="text-md">Choose new owner</label>
              </div>
              {newOwner && (
                <div className="p-4 bg-primary rounded-lg px-6 space-x-2 flex justify-between">
                  <div className="flex space-x-2">
                    <Image
                      src={newOwner.avatar}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full"
                    />
                    <span className="mt-0.5">~{newOwner.name}</span>
                  </div>
                  <span className="uppercase opacity-80">{newOwner.role}</span>
                </div>
              )}

              <RadioGroup
                defaultValue={newOwnerId ?? undefined}
                onValueChange={(v) => setNewOwnerId(v)}
                className="flex-grow ml-2 space-y-0.5 overflow-y-auto"
              >
                {memebers?.map((m) => (
                  <label
                    key={m.id}
                    className="flex space-x-4 items-center bg-white/5 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <RadioGroupItem value={m.id + ""} />
                    <div className="flex space-x-2">
                      <Image
                        src={m.avatar}
                        width={40}
                        height={40}
                        alt=""
                        className="rounded-full"
                      />
                      <span className="mt-0.5">~{m.name}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}
          <LoaderButton
            isLoading={isMutating || isMutatingOwner}
            className="self-end"
            onClick={() => leaveGroup(close)}
          >
            Leave
          </LoaderButton>
        </div>
      )}
    </ConfirmDialog>
  );
}
