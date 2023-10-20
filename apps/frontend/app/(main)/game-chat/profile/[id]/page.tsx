"use client";

import GoBackBtn from "../../components/chat-go-back";
import UserGameProfile from "../_components/profile";
import { useParams } from "next/navigation";
import { z } from "zod";
import FullPlaceHolder from "@/components/ui/full-placeholder";

export default function GameProfile() {
  const params = useParams();
  const userIdResult = z
    .string()
    .regex(/\d+/)
    .transform(Number)
    .safeParse(params.id);

  if (!userIdResult.success)
    return (
      <>
        <GoBackBtn>
          <h3 className="sm">Profile</h3>
        </GoBackBtn>
        <FullPlaceHolder text="Invalid userId" />
      </>
    );

  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Profile</h3>
      </GoBackBtn>
      <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8  md:p-4 md:px-6 md:pt-0">
        <UserGameProfile userId={userIdResult.data} />
      </div>
    </>
  );
}
