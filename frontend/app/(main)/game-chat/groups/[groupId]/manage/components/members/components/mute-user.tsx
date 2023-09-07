import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/confirm-dialog";
import { ActionType } from "./action.type";
import { useMuteGroupUser } from "@/api-hooks/groups/use-mute-group-user";
import { useState } from "react";
import { LoaderButton } from "@/components/ui/loader-button";

export default function MuteUser({ user, groupId }: ActionType) {
  const { trigger, isMutating } = useMuteGroupUser("" + groupId);
  const [period, setPeriod] = useState<string>("");

  const muteUser = async (close: () => void) => {
    try {
      await trigger({ userId: user.id, period: parseInt(period) });
      close();
    } catch (_error) {}
  };

  const onValueChanged = (v: string) => {
    try {
      setPeriod(v);
    } catch (error) {}
  };

  return (
    <ConfirmDialog action="Mute">
      {({ close }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            muteUser(close);
          }}
          className="space-y-6 mx-auto py-8"
        >
          <h4 className="text-lg opacity-90 text-foreground text-center">
            Muting user: {user.name}
          </h4>
          <div className="flex space-x-4">
            <Select
              onValueChange={onValueChanged}
              defaultValue={period.length === 0 ? undefined : "Choose Time"}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Choose Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Choose Time</SelectLabel>
                  <SelectItem value={(5 * 60).toString()}>5min</SelectItem>
                  <SelectItem value={(10 * 60).toString()}>10min</SelectItem>
                  <SelectItem value={(30 * 60).toString()}>30min</SelectItem>
                  <SelectItem value={(60 * 60).toString()}>1h</SelectItem>
                  <SelectItem value={(24 * 60 * 60).toString()}>24h</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <LoaderButton type="submit" isLoading={isMutating}>
              mute
            </LoaderButton>
          </div>
        </form>
      )}
    </ConfirmDialog>
  );
}
