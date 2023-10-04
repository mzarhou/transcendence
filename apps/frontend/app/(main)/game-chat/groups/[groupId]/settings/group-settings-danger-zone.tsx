import { useDeleteGroup } from "@/api-hooks/groups/use-delete-group";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { cn } from "@/lib/utils";
import { Group } from "@transcendence/db";

export default function GroupSettingsDangerZone({
  className,
  group,
}: {
  className?: string;
  group: Group;
}) {
  const { trigger, isMutating } = useDeleteGroup(group.id + "");

  const deleteGroup = () => {
    try {
      trigger();
    } catch (error) {}
  };

  return (
    <div
      className={cn(
        "relative mt-8 flex items-center justify-center rounded-lg border border-red-500 px-6 py-8",
        className
      )}
    >
      <h4 className="absolute inset-x-0 -top-4 mx-auto w-32 bg-card text-center text-red-200">
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
          <div className="flex flex-col space-y-4 px-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="rounded-sm bg-gray-100 px-1 py-0.5 text-sm font-semibold text-slate-900">
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
