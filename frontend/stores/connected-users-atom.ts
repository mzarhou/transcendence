import { atom, useAtom } from "jotai";

export const connectedFriendsAtom = atom<Set<number>>(new Set([]));

export const useIsFriendConnected = () => {
  const [connectedFriends] = useAtom(connectedFriendsAtom);
  return (friendId: number) => connectedFriends.has(friendId);
};
