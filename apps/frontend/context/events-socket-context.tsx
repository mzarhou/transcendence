"use client";

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
  GroupMessageWithSender,
  GROUP_USER_CONNECTED_EVENT,
  GroupUserConnectedData,
  GROUP_USER_DISCONNECTED_EVENT,
} from "@transcendence/db";
import { useToast } from "@/components/ui/use-toast";
import { useSWRConfig, Cache } from "swr";
import { getMessagesKey } from "@/api-hooks/use-messages";
import { useAtom } from "jotai";
import { connectedFriendsAtom } from "@/stores/connected-users-atom";
import { friendRequestsKey } from "@/api-hooks/friend-requests/use-friend-requests";
import { unreadMessagesKey } from "@/api-hooks/use-unread-messages";
import { env } from "@/env/client.mjs";
import { notificationsKey } from "@/api-hooks/notifications/use-notifications";
import { GROUP_MESSAGE_EVENT } from "@transcendence/db";
import { GroupMessage } from "@transcendence/db";
import { getGroupMessagesKey } from "@/api-hooks/groups/use-group-messages";
import { GROUP_DELETED_NOTIFICATION } from "@transcendence/db";
import { ADD_ADMIN_NOTIFICATION } from "@transcendence/db";
import { REMOVE_ADMIN_NOTIFICATION } from "@transcendence/db";
import { GROUP_BANNED_NOTIFICATION } from "@transcendence/db";
import { GROUP_UNBANNED_NOTIFICATION } from "@transcendence/db";
import { GROUP_KICKED_NOTIFICATION } from "@transcendence/db";
import { JOIN_GROUP_NOTIFICATION } from "@transcendence/db";
import { LEAVE_GROUP_NOTIFICATION } from "@transcendence/db";
import { GROUP_NOTIFICATION_PAYLOAD } from "@transcendence/db";
import { groupsKey } from "@/api-hooks/groups/use-groups";
import { groupKey } from "@/api-hooks/groups/use-group";
import { api } from "@/lib/api";
import { friendsKey } from "@/api-hooks/use-friends";
import { UNFRIEND_EVENT } from "@transcendence/db";
import { GROUP_INVITATION_NOTIFICATION } from "@transcendence/db";

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
        _socket.on(FRIEND_CONNECTED, async (data: FriendConnectedData) => {
          onFriendConnected(data);
          mutate(friendsKey);
        });
        _socket.on(FRIEND_DISCONNECTED, (data: FriendDisconnectedData) => {
          onFriendDisconnected(data);
        });

        _socket.on(FRIEND_REQUEST_EVENT, (_data: FriendRequest) => {
          mutate(friendRequestsKey);
          mutate(notificationsKey);
        });

        _socket.on(FRIEND_REQUEST_ACCEPTED_EVENT, () => {
          mutate(notificationsKey);
        });

        _socket.on(UNFRIEND_EVENT, () => {
          mutate(friendsKey);
        });

        [
          GROUP_DELETED_NOTIFICATION,
          ADD_ADMIN_NOTIFICATION,
          REMOVE_ADMIN_NOTIFICATION,
          GROUP_BANNED_NOTIFICATION,
          GROUP_UNBANNED_NOTIFICATION,
          GROUP_KICKED_NOTIFICATION,
          JOIN_GROUP_NOTIFICATION,
          LEAVE_GROUP_NOTIFICATION,
          GROUP_INVITATION_NOTIFICATION,
        ].forEach((event) => {
          _socket.on(event, (_data: GROUP_NOTIFICATION_PAYLOAD) => {
            mutate(notificationsKey);
          });
        });
        _socket.on(
          GROUP_DELETED_NOTIFICATION,
          (_data: GROUP_NOTIFICATION_PAYLOAD) => {
            mutate(groupsKey);
          }
        );
        [GROUP_USER_CONNECTED_EVENT, GROUP_USER_DISCONNECTED_EVENT].forEach(
          (event) => {
            _socket.on(event, (data: GroupUserConnectedData) => {
              mutate(groupKey(data.groupId + ""));
            });
          }
        );
        _socket.on(
          GROUP_MESSAGE_EVENT,
          (message: GroupMessage & GroupMessageWithSender) => {
            mutate(
              getGroupMessagesKey(message.groupId.toString()),
              (data: any) => [...(data ?? []), message]
            );
          }
        );

        // TODO
        // add group notifications
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
      await api.post("/authentication/refresh-tokens");
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
