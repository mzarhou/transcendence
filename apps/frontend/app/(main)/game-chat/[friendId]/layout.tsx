"use client";

import { useFriend } from "@/api-hooks/use-friend";
import FullLoader from "@/components/ui/full-loader";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Layout({
  params,
  children,
}: {
  children: ReactNode;
  params: {
    friendId: string;
  };
}) {
  const { data: friend, isLoading, error } = useFriend(params.friendId);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace("/game-chat");
    }
  }, [error]);

  if (isLoading) {
    return <FullLoader />;
  }
  if (friend) {
    return <>{children}</>;
  }
}
