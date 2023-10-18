import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "../user-context";
import { useSWRConfig } from "swr";
import {
  FRIEND_CONNECTED,
  FRIEND_DISCONNECTED,
  FRIEND_REQUEST_ACCEPTED_EVENT,
  FRIEND_REQUEST_EVENT,
  FriendConnectedData,
  FriendDisconnectedData,
  FriendRequest,
  InGameEventData,
  ServerGameEvents,
  UNFRIEND_EVENT,
} from "@transcendence/db";
import { friendsKey } from "@/api-hooks/use-friends";
import { friendRequestsKey } from "@/api-hooks/friend-requests/use-friend-requests";
import { notificationsKey } from "@/api-hooks/notifications/use-notifications";
import { connectedFriendsAtom } from "@/stores/connected-users-atom";
import { useAtom } from "jotai";
import { inGameFriendsAtom } from "@/stores/in-game-users-atom";

export default function useFriendsEvents(socket: Socket) {
  const { user } = useUser();
  const { mutate } = useSWRConfig();

  const onFriendConnected = useOnFriendConnected();
  const onFriendDisconnected = useOnFriendDisconnected();
  const onFriendInGameStatusChanged = useOnFriendInGameStatusChanged();

  useEffect(() => {
    if (!user) return;
    if (socket.hasListeners(FRIEND_CONNECTED)) return;

    socket.on(FRIEND_CONNECTED, async (data: FriendConnectedData) => {
      onFriendConnected(data);
      mutate(friendsKey);
    });

    socket.on(FRIEND_DISCONNECTED, (data: FriendDisconnectedData) => {
      onFriendDisconnected(data);
    });

    socket.on(ServerGameEvents.IN_GAME, (data: InGameEventData) => {
      onFriendInGameStatusChanged(data);
    });

    socket.on(FRIEND_REQUEST_EVENT, (_data: FriendRequest) => {
      mutate(friendRequestsKey);
      mutate(notificationsKey);
    });

    socket.on(FRIEND_REQUEST_ACCEPTED_EVENT, () => {
      mutate(notificationsKey);
    });

    socket.on(UNFRIEND_EVENT, () => {
      mutate(friendsKey);
    });
  }, [user]);
}

const useOnFriendConnected = () => {
  const [, setConnectedFriends] = useAtom(connectedFriendsAtom);

  const onFriendConnected = useCallback(({ friendId }: FriendConnectedData) => {
    setConnectedFriends(
      (oldFriendsSet) => new Set(oldFriendsSet.add(friendId))
    );
  }, []);

  return onFriendConnected;
};

const useOnFriendDisconnected = () => {
  const [, setConnectedFriends] = useAtom(connectedFriendsAtom);

  const onFriendDisconnected = useCallback(
    ({ friendId }: FriendDisconnectedData) => {
      setConnectedFriends((oldFriendsSet) => {
        oldFriendsSet.delete(friendId);
        return new Set(oldFriendsSet);
      });
    },
    []
  );

  return onFriendDisconnected;
};

const useOnFriendInGameStatusChanged = () => {
  const [, setInGameFriends] = useAtom(inGameFriendsAtom);

  const onFriendConnected = ({ inGame, friendId }: InGameEventData) => {
    if (inGame) {
      setInGameFriends((oldFriendsSet) => new Set(oldFriendsSet.add(friendId)));
    } else {
      setInGameFriends((oldFriendsSet) => {
        oldFriendsSet.delete(friendId);
        return new Set(oldFriendsSet);
      });
    }
  };

  return onFriendConnected;
};
