"use client";

import { useUser } from "app/context/user-context";
import { Loader2 } from "lucide-react";
import Disable2fa from "./Disable2fa";
import Enable2fa from "./Enable2fa";
import ProfileInfo from "./ProfileInfo";

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
    <>
      <div className="space-y-12">
        <h2 className="text-h2 font-normal">General Settings</h2>
        <h4 className="bg-gray-100 border-t"></h4>
        <ProfileInfo />
        {user.isTfaEnabled ? <Disable2fa /> : <Enable2fa />}
      </div>
    </>
  );
}
