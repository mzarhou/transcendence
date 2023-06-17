"use client";

import { useUser } from "../context/user-context";
import { Loader2 } from "lucide-react";
import Disable2fa from "./Disable2fa";
import Enable2fa from "./Enable2fa";

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return (
      <main className="container">
        <Loader2 className="animate-spin" />
      </main>
    );
  }
  if (!user) {
    return <></>;
  }
  return (
    <main className="container">
      {user.isTfaEnabled ? <Disable2fa /> : <Enable2fa />}
    </main>
  );
}
