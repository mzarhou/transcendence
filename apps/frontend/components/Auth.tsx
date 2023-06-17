"use client";

import { useUser } from "@/app/context/user-context";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

/**
 * componet to render content for authenticated users
 */
export default function Auth(props: {
  children: ReactNode;
  Loader?: ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (props.Loader && isLoading) {
    return <>{props.Loader}</>;
  }
  return <>{user ? props.children : <></>}</>;
}
