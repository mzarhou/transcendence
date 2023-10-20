import { atom, useAtom } from "jotai";

export const inGameFriendsAtom = atom<Set<number>>(new Set([]));

export const useIsFriendInGame = (friendId: number) => {
  const [inGameFriends] = useAtom(inGameFriendsAtom);
  return inGameFriends.has(friendId);
};
