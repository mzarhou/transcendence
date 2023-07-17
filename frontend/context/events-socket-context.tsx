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
import { User } from "@transcendence/common";
import { UNAUTHORIZED_EVENT } from "@transcendence/common";
import { useToast } from "@/components/ui/use-toast";
import { MESSAGE_ERROR_EVENT } from "@transcendence/common";

const EventsSocketContext = createContext<Socket | null>(null);

export function getSocket(currentUser: User) {
  // TODO: user NEXT_PUBLIC_API_URL
  const socket = io("http://localhost:8080", {
    withCredentials: true,
  });

  socket.on(UNAUTHORIZED_EVENT, async () => {
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

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const _socket = getSocket(currentUser);
    _socket.on(MESSAGE_ERROR_EVENT, (message: string) =>
      toast({
        variant: "destructive",
        description: message.length > 0 ? message : "Failed to send message",
      })
    );
    setSocket(_socket);
  }, [currentUser]);

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};

export const useSocket = () => useContext(EventsSocketContext);
