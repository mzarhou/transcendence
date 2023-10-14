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
  const { data: group, isLoading } = useGroup(params.groupId);
  const router = useRouter();

  useEffect(() => {
    if (group && group.role === "MEMBER") router.replace("/game-chat");
  }, [router, group]);

  if (isLoading) {
    return <FullLoader />;
  }
  if (group && group.role === "ADMIN") {
    return <>{children}</>;
  }
}
