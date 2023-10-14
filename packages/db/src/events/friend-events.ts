export const FRIEND_CONNECTED = "friend_connected";
export type FriendConnectedData = {
  friendId: number;
};

export const FRIEND_DISCONNECTED = "friend_disconnected";
export type FriendDisconnectedData = FriendConnectedData;
