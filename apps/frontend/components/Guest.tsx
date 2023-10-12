"use client";

import { useUser } from "@/context/user-context";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

/**
 * componet to render content for guest users
 */
export default function Guest(props: {
  children: ReactNode;
  Loader?: ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (props.Loader && isLoading) {
    return <>{props.Loader}</>;
  }
  return <>{user ? <></> : props.children}</>;
}
