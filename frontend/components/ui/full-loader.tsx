import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type FullLoaderProps = {
  className?: string;
};
export default function FullLoader({ className }: FullLoaderProps) {
  return (
    <div className="flex h-full flex-grow items-center justify-center">
      <Loader2 className={cn("h-9 w-9 animate-spin", className)} />
    </div>
  );
}
