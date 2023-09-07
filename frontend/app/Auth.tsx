"use client";

import FullLoader from "@/components/ui/full-loader";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Auth({ children }: { children?: ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const require2fa = user?.isTfaEnabled && !user.isTfaCodeProvided;

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    }
    if (require2fa) {
      router.replace("/2fa");
    }
  }, [user, isLoading, require2fa]);

  if (require2fa) {
    return <FullLoader className="w-12 h-12" />;
  }

  if (user && !isLoading) {
    return <>{children}</>;
  }

  return <FullLoader className="w-12 h-12" />;
}
