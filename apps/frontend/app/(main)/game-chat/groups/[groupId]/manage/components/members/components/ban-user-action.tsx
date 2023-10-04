import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { ActionType } from "./action.type";
import { useBanGroupUser } from "@/api-hooks/groups/use-ban-group-user";

export default function BanUser({ user, groupId }: ActionType) {
  const { trigger, isMutating } = useBanGroupUser("" + groupId);

  const banUser = async (close: () => void) => {
    try {
      await trigger({ userId: user.id });
      close();
    } catch (_error) {}
  };

  return (
    <ConfirmDialog action="Ban">
      {({ close }) => (
        <>
          <p className="flex items-center space-x-1">
            <span>Are you sure you want to</span>
            <span className="text-destructive">Ban</span>
            <span>{user.name} ?</span>
          </p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <LoaderButton
              isLoading={isMutating}
              variant="destructive"
              onClick={() => banUser(close)}
            >
              Ban
            </LoaderButton>
          </div>
        </>
      )}
    </ConfirmDialog>
  );
}
