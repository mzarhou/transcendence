"use client";

import FullLoader from "@/components/ui/full-loader";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Guest({ children }: { children?: ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.replace("/game-chat");
    }
  }, [user, isLoading]);

  if (!user && !isLoading) {
    return <>{children}</>;
  }

  return <FullLoader className="w-12 h-12" />;
}
