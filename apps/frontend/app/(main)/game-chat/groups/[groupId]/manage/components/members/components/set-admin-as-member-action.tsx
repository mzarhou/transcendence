import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { ActionType } from "./action.type";
import { useRemoveGroupAdmin } from "@/api-hooks/groups/use-remove-group-admin";

export default function SetAdminAsMember({ user, groupId }: ActionType) {
  const { trigger, isMutating } = useRemoveGroupAdmin("" + groupId);

  const addAdmin = async (close: () => void) => {
    try {
      await trigger({ userId: user.id });
      close();
    } catch (_error) {}
  };

  return (
    <ConfirmDialog action="Set as member">
      {({ close }) => (
        <>
          <p>Are you sure you want to set {user.name} as member ? </p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <LoaderButton
              variant="destructive"
              isLoading={isMutating}
              onClick={() => addAdmin(close)}
            >
              Set as member
            </LoaderButton>
          </div>
        </>
      )}
    </ConfirmDialog>
  );
}
