import { cn } from "@/lib/utils";

export default function FullPlaceHolder({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-grow items-center justify-center text-lg text-foreground/50",
        className
      )}
    >
      {text}
    </div>
  );
}
