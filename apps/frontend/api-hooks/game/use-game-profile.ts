import { api } from "@/lib/api";
import { GameProfile, User } from "@transcendence/db";
import useSWR from "swr";

export const gameProfileKey = (userId: number) => `/rank/${userId}`;

export function useGameProfile(userId: number) {
  return useSWR(gameProfileKey(userId), (url) =>
    api.get<GameProfile>(url).then((data) => data.data)
  );
}
