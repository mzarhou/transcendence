"use client";

import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "./user-context";
import { MESSAGE_EVENT, MessageType, User } from "@transcendence/common";
import { useToast } from "@/components/ui/use-toast";
import { ERROR_EVENT } from "@transcendence/common";
import { WsErrorData } from "@transcendence/common";
import { useSWRConfig } from "swr";
import { getMessagesKey } from "@/api-hooks/use-messages";

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

function useSocket_() {
  const { user: currentUser } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  const onMessage = useOnMessage();
  const onError = useOnError();

  useEffect(() => {
    if (!currentUser) return;

    // TODO: user NEXT_PUBLIC_API_URL
    const _socket = io("http://localhost:8080", {
      withCredentials: true,
    });

    if (!_socket.hasListeners("connect")) {
      _socket.on("connect", () => {
        console.log("error event");
        _socket.on(ERROR_EVENT, async (data: WsErrorData) =>
          onError(_socket, data)
        );
        console.log("message event");
        _socket.on(MESSAGE_EVENT, (data: MessageType) => onMessage(data));
      });
    }

    setSocket(_socket);
  }, [currentUser]);

  return socket;
}

const useOnMessage = () => {
  const { mutate } = useSWRConfig();
  const { user: currentUser } = useUser();

  return (data: MessageType) => {
    if (!currentUser) return;

    const friendId =
      data.recipientId === currentUser.id ? data.senderId : data.recipientId;
    mutate(
      getMessagesKey(friendId),
      (messages) => [...(messages ?? []), data],
      { revalidate: false }
    );
  };
};

const useOnError = () => {
  const { toast } = useToast();

  return async (socket: Socket, data: WsErrorData) => {
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
  };
};
