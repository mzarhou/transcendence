"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FakeChatSearch({ className }: { className?: string }) {
  return (
    <Link href="/game-chat/search">
      <div
        className={cn(
          "flex h-10 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span>Search @username, groups</span>
      </div>
    </Link>
  );
}
