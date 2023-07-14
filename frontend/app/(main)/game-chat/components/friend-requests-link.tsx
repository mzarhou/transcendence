"use client";

import { useFriendRequests } from "@/api-hooks/use-friend-requests";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function FriendRequestsLink() {
  const { data, isLoading } = useFriendRequests();
  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  const friendRequestsCount = data?.length ?? 0;
  return (
    <Link href="/game-chat/friend-requests" className="relative">
      <UserPlus />
      {friendRequestsCount !== 0 && (
        <div className="absolute -left-2 top-2 aspect-square w-[18px] rounded-full bg-red-500 text-center text-xs text-white">
          {friendRequestsCount > 9 ? "9+" : friendRequestsCount}
        </div>
      )}
    </Link>
  );
}
