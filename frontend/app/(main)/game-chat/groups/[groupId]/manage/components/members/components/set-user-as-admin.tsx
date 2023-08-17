import { useAddGroupAdmin } from "@/api-hooks/groups/use-add-group-admin";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { ActionType } from "./action.type";

export default function SetUserAsAdmin({ user, groupId }: ActionType) {
  const { trigger, isMutating } = useAddGroupAdmin("" + groupId);

  const addAdmin = async (close: () => void) => {
    try {
      await trigger({ userId: user.id });
      close();
    } catch (_error) {}
  };

  return (
    <ConfirmDialog action="Set as admin">
      {({ close }) => (
        <>
          <p>Are you sure you want to set {user.name} as admin ? </p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <LoaderButton
              isLoading={isMutating}
              onClick={() => addAdmin(close)}
            >
              Set as admin
            </LoaderButton>
          </div>
        </>
      )}
    </ConfirmDialog>
  );
}
