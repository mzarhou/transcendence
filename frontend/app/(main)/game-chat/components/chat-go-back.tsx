"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  className?: string;
  withText?: boolean;
};
export default function GoBackBtn({ className, withText }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/game-chat") return <></>;

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "absolute left-4 top-3 flex items-center space-x-2 text-chat-foreground/80 md:static",
        className
      )}
    >
      <ChevronLeft />
      {withText && <span>go back</span>}
    </button>
  );
}
