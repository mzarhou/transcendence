import { cn } from "@/lib/utils";

type NoticationsBadgeProps = {
  count: number;
  className?: string;
};
const NoticationsBadge = ({ count, className }: NoticationsBadgeProps) => {
  return (
    <>
      {count > 0 && (
        <div
          className={cn(
            "absolute bottom-1.5 right-0.5 flex aspect-square h-5 items-center justify-center rounded-full bg-red-400 text-xs",
            count > 9 ? "h-5" : "h-4",
            className
          )}
        >
          {count > 9 ? "9+" : count}
        </div>
      )}
    </>
  );
};

export { NoticationsBadge };
