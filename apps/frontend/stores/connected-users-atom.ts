import { atom, useAtom } from "jotai";

export const connectedFriendsAtom = atom<Set<number>>(new Set([]));

export const useIsFriendConnected = (friendId: number) => {
  const [connectedFriends] = useAtom(connectedFriendsAtom);
  return connectedFriends.has(friendId);
};
