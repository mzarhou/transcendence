"use client";

import { GroupType } from "@/api-hooks/use-group";
import { useSearchUsers } from "@/api-hooks/use-search-users";
import ConfirmDialog from "@/components/confirm-dialog";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/ui/loader-button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { ActionLink } from "./action-link";

export function InviteUserAction({ group }: { group: GroupType }) {
  return (
    <ConfirmDialog
      trigger={
        <ActionLink
          text="Invite User"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <UserPlus className="w-5" />
        </ActionLink>
      }
    >
      {({ close }) => (
        <div className="h-[90vh] space-y-6">
          <InviteUserActionDialogContent close={close} group={group} />
        </div>
      )}
    </ConfirmDialog>
  );
}

function InviteUserActionDialogContent({
  close,
  group,
}: {
  close: () => void;
  group: GroupType;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isLoading } = useSearchUsers(debouncedQuery);

  const users = data?.filter((u) => !group.users.find((gu) => gu.id === u.id));

  const [isMutating, setIsMutating] = useState(false);
  const inviteUser = async (_userId: number) => {
    // TODO: implement
    setIsMutating(true);
    await new Promise((res) => {
      setTimeout(res, 2000);
    }).finally(() => {
      setIsMutating(false);
      close();
    });
  };

  return (
    <>
      <h4>Invite User</h4>
      <Input
        autoFocus
        id="search-users"
        placeholder="Search users"
        value={query}
        onChange={(e) => {
          e.stopPropagation();
          setQuery(e.target.value);
        }}
      />
      {isLoading && <Loader2 className="mx-auto animate-spin" />}
      <div className="">
        {!users ? (
          <FullPlaceHolder text="No user found" />
        ) : (
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="flex space-x-2">
                <img src={u.avatar} className="h-12 w-12 rounded-full" />
                <div className="flex flex-grow justify-between border-b border-border/30">
                  <p>~{u.name}</p>
                  <LoaderButton
                    isLoading={isMutating}
                    size="sm"
                    onClick={() => inviteUser(u.id)}
                  >
                    Invite
                  </LoaderButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
