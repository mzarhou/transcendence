"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type ConfirmDialogProps = (
  | {
      action: string;
      trigger?: never;
    }
  | {
      trigger: ReactNode;
      action?: never;
    }
) & {
  children?: (props: { close: () => void }) => ReactNode;
};
export default function ConfirmDialog({
  action,
  trigger,
  children,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {action !== undefined ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            {action}
          </DropdownMenuItem>
        ) : (
          trigger
        )}
      </DialogTrigger>
      <DialogContent className="text-card-foreground">
        {children?.({ close })}
      </DialogContent>
    </Dialog>
  );
}
