import ChatBody from "./chat-body";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { log } from "@/lib/utils";
import { serverApi } from "@/lib/serverApi";

async function fetchFriend(friendId: string) {
  const accessToken = cookies().get("accessToken")?.value ?? "";
  try {
    const { data } = await serverApi.get(`/users/${friendId}`, {
      headers: {
        Authorization: `Beaer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    log("failed to fetch friend ❌");
  }
  return null;
}

type ChatPageType = {
  params: {
    friendId: string;
  };
};
export default async function ChatPage({ params: { friendId } }: ChatPageType) {
  const friend = await fetchFriend(friendId);
  if (!friend) {
    redirect("/game-chat");
  }
  return <ChatBody friendId={parseInt(friendId)} />;
}
