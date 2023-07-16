import { api } from "@/lib/api";
import ChatBody from "./chat-body";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function fetchFriend(friendId: string) {
  const accessToken = cookies().get("accessToken")?.value ?? "";
  try {
    const { data } = await api.get(`/users/${friendId}`, {
      headers: {
        Authorization: `Beaer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
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
