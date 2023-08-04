import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { ActionType } from "./action.type";
import { useKickGroupUser } from "@/api-hooks/groups/use-kick-group-user";

export default function KickUser({ user, groupId }: ActionType) {
  const { trigger, isMutating } = useKickGroupUser("" + groupId);

  const kickUser = async (close: () => void) => {
    try {
      await trigger({ userId: user.id });
      close();
    } catch (_error) {}
  };

  return (
    <ConfirmDialog action="Kick">
      {({ close }) => (
        <>
          <p>Are you sure you want to kick {user.name} ? </p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <LoaderButton
              isLoading={isMutating}
              variant="destructive"
              onClick={() => kickUser(close)}
            >
              Kick
            </LoaderButton>
          </div>
        </>
      )}
    </ConfirmDialog>
  );
}
