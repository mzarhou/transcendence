"use client";

import { useGroup } from "@/api-hooks/groups/use-group";
import FullLoader from "@/components/ui/full-loader";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Layout({
  params,
  children,
}: {
  children: ReactNode;
  params: {
    groupId: string;
  };
}) {
  const { data: group, isLoading, error } = useGroup(params.groupId);
  const { user, isLoading: isLoadingUser, error: userError } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userError || error || group?.ownerId !== user?.id) {
      router.replace("/game-chat");
    }
  }, [error, userError, group, user]);

  if (isLoading || isLoadingUser) {
    return <FullLoader />;
  }
  if (user && group && group.ownerId === user.id) {
    return <>{children}</>;
  }
}
