"use client";

import { useGroup } from "@/api-hooks/groups/use-group";
import FullLoader from "@/components/ui/full-loader";
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
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace("/game-chat");
    }
  }, [error]);

  if (isLoading) {
    return <FullLoader />;
  }
  if (group) {
    return <>{children}</>;
  }
}
