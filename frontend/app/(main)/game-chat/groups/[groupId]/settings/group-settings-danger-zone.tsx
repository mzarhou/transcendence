import { useDeleteGroup } from "@/api-hooks/groups/use-delete-group";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { cn } from "@/lib/utils";
import { Group } from "@transcendence/common";

export default function GroupSettingsDangerZone({
  className,
  group,
}: {
  className?: string;
  group: Group;
}) {
  const { trigger, isMutating } = useDeleteGroup(group.id);

  const deleteGroup = () => {
    try {
      trigger();
    } catch (error) {}
  };

  return (
    <div
      className={cn(
        "border border-red-500 py-8 px-6 rounded-lg relative mt-8 flex items-center justify-center",
        className,
      )}
    >
      <h4 className="text-center w-32 mx-auto bg-card inset-x-0 absolute -top-4 text-red-200">
        Danger Zone
      </h4>
      <ConfirmDialog
        trigger={
          <Button variant="destructive" className="mx-auto w-full">
            Delete Group
          </Button>
        }
      >
        {({ close }) => (
          <div className="space-y-4 flex flex-col px-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="px-1 py-0.5 rounded-sm bg-gray-100 text-slate-900 text-sm font-semibold">
                {group.name}
              </span>{" "}
              group
            </p>
            <LoaderButton
              isLoading={isMutating}
              variant="destructive"
              className="self-end"
              onClick={deleteGroup}
            >
              Delete
            </LoaderButton>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
