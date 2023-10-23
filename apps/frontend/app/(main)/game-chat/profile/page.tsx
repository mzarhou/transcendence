"use client";

import { useUser } from "@/context";
import GoBackBtn from "../components/chat-go-back";
import UserGameProfile from "./_components/profile";

export default function GameProfile() {
  const { user } = useUser();

  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Your Profile</h3>
      </GoBackBtn>
      <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8  md:p-4 md:px-6 md:pt-0">
        {user && <UserGameProfile userId={user.id} />}
      </div>
    </>
  );
}
