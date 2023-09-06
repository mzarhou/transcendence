"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  full?: boolean;
};
export default function GoBackBtn({ className, children, full }: Props) {
  full ??= true;

  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/game-chat") return <></>;

  const goBack = () => router.back();

  return (
    <div
      className={cn(
        "flex items-center md:ml-4 py-5",
        {
          "cursor-pointer": full,
        },
        className,
      )}
      onClick={full ? goBack : undefined}
    >
      <button
        onClick={full ? undefined : goBack}
        className="flex items-center space-x-2 text-chat-foreground/80 md:static"
      >
        <ChevronLeft />
      </button>
      <div className="flex-grow pl-2">{children}</div>
    </div>
  );
}
