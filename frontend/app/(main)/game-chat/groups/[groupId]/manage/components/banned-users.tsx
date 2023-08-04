"use client";

import { GroupType } from "@/api-hooks/use-group";
import { queryAtom } from "./search-query-atom";
import { useAtom } from "jotai";
import { useGroupUsers } from "@/api-hooks/groups/use-group-users";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import FullLoader from "@/components/ui/full-loader";
import { useUnbanGroupUser } from "@/api-hooks/groups/use-unban-user";
import { LoaderButton } from "@/components/ui/loader-button";

export default function BannedUsers({ group }: { group: GroupType }) {
  const [query] = useAtom(queryAtom);

  const { data, isLoading } = useGroupUsers({
    filter: "banned",
    groupId: group.id + "",
  });

  const { trigger, isMutating } = useUnbanGroupUser(group.id + "");

  const unban = async (userId: number, closeDialog: () => void) => {
    try {
      await trigger({ userId });
      closeDialog();
    } catch (error) {}
  };

  const users =
    (query.length
      ? data?.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
      : data) ?? [];

  return (
    <>
      <div className="mt-8 space-y-3">
        {isLoading ? (
          <FullLoader />
        ) : users.length === 0 ? (
          <FullPlaceHolder text="No user banned" />
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex space-x-2">
              <img src={u.avatar} className="h-12 w-12 rounded-full" />
              <div className="flex flex-grow justify-between border-b">
                <p>~{u.name}</p>
                <div className="mt-1 flex text-card-foreground/50">
                  <ConfirmDialog trigger={<Button size="sm">Unban</Button>}>
                    {({ close }) => (
                      <div className="space-y-2">
                        <p>Unban {u.name} ?</p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={close}
                            className="self-end"
                            variant="outline"
                          >
                            Cancle
                          </Button>
                          <LoaderButton
                            onClick={() => unban(u.id, close)}
                            isLoading={isMutating}
                            className="self-end"
                          >
                            Unban
                          </LoaderButton>
                        </div>
                      </div>
                    )}
                  </ConfirmDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
