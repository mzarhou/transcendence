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

export function getSocket(currentUser: User) {
  // TODO: user NEXT_PUBLIC_API_URL
  const socket = io("http://localhost:8080", {
    withCredentials: true,
  });

  socket.on(ERROR_EVENT, async (data: WsErrorData) => {
    if (data.statusCode !== 401) return;
    try {
      // try to refresh tokens
      await axios.post("/api/auth/refresh-tokens");
      setTimeout(() => {
        socket.connect();
      }, 200);
    } catch (error) {}
  });
  return socket;
}

export const EventsSocketProvider = ({ children }: { children: ReactNode }) => {
  const { user: currentUser } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const _socket = getSocket(currentUser);
    if (!_socket.hasListeners(ERROR_EVENT)) {
      _socket.on(ERROR_EVENT, (data: WsErrorData) =>
        toast({
          variant: "destructive",
          description: data.message,
        })
      );
    }
    if (!_socket.hasListeners(MESSAGE_EVENT)) {
      _socket.on(MESSAGE_EVENT, (data: MessageType) => {
        const friendId =
          data.recipientId === currentUser.id
            ? data.senderId
            : data.recipientId;
        mutate(
          getMessagesKey(friendId),
          (messages) => [...(messages ?? []), data],
          { revalidate: false }
        );
      });
    }

    setSocket(_socket);
  }, [currentUser]);

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};

export const useSocket = () => useContext(EventsSocketContext);
