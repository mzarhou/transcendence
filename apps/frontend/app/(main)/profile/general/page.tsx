"use client";

import { useUser } from "@/context/user-context";
import { Loader2 } from "lucide-react";
import ProfileInfo from "./ProfileInfoSection";
import TfaSection from "./2fa-section";

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
        <h4 className="border-t bg-gray-100"></h4>
        <ProfileInfo />
        <TfaSection />
      </div>
    </>
  );
}
