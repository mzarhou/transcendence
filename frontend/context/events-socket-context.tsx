"use client";

import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "./user-context";
import {
  FRIEND_CONNECTED,
  FRIEND_DISCONNECTED,
  FRIEND_REQUEST_ACCEPTED_EVENT,
  FRIEND_REQUEST_EVENT,
  FriendConnectedData,
  FriendDisconnectedData,
  FriendRequest,
  MESSAGE_EVENT,
  MessageType,
  ERROR_EVENT,
  WsErrorData,
  MESSAGE_READ_EVENT,
} from "@transcendence/common";
import { useToast } from "@/components/ui/use-toast";
import { useSWRConfig } from "swr";
import { getMessagesKey } from "@/api-hooks/use-messages";
import { useAtom } from "jotai";
import { connectedFriendsAtom } from "@/stores/connected-users-atom";
import { friendRequestsKey } from "@/api-hooks/use-friend-requests";
import { unreadMessagesKey } from "@/api-hooks/use-unread-messages";
import { env } from "@/env/client.mjs";

const EventsSocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(EventsSocketContext);

export const EventsSocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket_();

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};

function getFriendIdFromMessage(userId: number, data: MessageType) {
  return data.recipientId === userId ? data.senderId : data.recipientId;
}

function useSocket_() {
  const { user: currentUser } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  const onMessage = useOnMessage();
  const onError = useOnError();
  const onFriendConnected = useOnFriendConnected();
  const onFriendDisconnected = useOnFriendDisconnected();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!currentUser) return;

    const _socket = io(env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    if (!_socket.hasListeners("connect")) {
      _socket.on("connect", () => {
        _socket.on(ERROR_EVENT, async (data: WsErrorData) =>
          onError(_socket, data)
        );
        _socket.on(MESSAGE_EVENT, (data: MessageType) => onMessage(data));
        _socket.on(MESSAGE_READ_EVENT, (data: MessageType) => {
          const friendId = getFriendIdFromMessage(currentUser.id, data);
          mutate(getMessagesKey(friendId));
          mutate(unreadMessagesKey);
        });
        _socket.on(FRIEND_CONNECTED, (data: FriendConnectedData) => {
          onFriendConnected(data);
        });
        _socket.on(FRIEND_DISCONNECTED, (data: FriendDisconnectedData) => {
          onFriendDisconnected(data);
        });
        [FRIEND_REQUEST_EVENT, FRIEND_REQUEST_ACCEPTED_EVENT].forEach(
          (event) => {
            _socket.on(event, (_data: FriendRequest) =>
              mutate(friendRequestsKey)
            );
          }
        );
      });
    }

    setSocket(_socket);
  }, [currentUser]);

  return socket;
}

const useOnMessage = () => {
  const { mutate } = useSWRConfig();
  const { user: currentUser } = useUser();

  const onMessage = useCallback(
    (data: MessageType) => {
      if (!currentUser) return;

      const friendId = getFriendIdFromMessage(currentUser.id, data);
      mutate(getMessagesKey(friendId));
      mutate(unreadMessagesKey);
    },
    [currentUser]
  );
  return onMessage;
};

const useOnError = () => {
  const { toast } = useToast();

  const onError = useCallback(async (socket: Socket, data: WsErrorData) => {
    if (data.statusCode !== 401) {
      toast({
        variant: "destructive",
        description: data.message,
      });
      return;
    }
    try {
      // try to refresh tokens
      await axios.post("/api/auth/refresh-tokens");
      setTimeout(() => {
        socket.connect();
      }, 200);
    } catch (error) {}
  }, []);
  return onError;
};

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
