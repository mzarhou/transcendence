"use client";

import FullLoader from "@/components/ui/full-loader";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Auth2fa({ children }: { children?: ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const require2fa = user?.isTfaEnabled && !user.isTfaCodeProvided;

  useEffect(() => {
    if (isLoading) return;
    if (!require2fa) {
      router.replace("/game-chat");
    }
    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, require2fa]);

  if (user && require2fa) {
    return <>{children}</>;
  }

  return <FullLoader className="w-12 h-12" />;
}
