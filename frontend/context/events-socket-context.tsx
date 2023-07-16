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

const EventsSocketContext = createContext<Socket | null>(null);

export function getSocket(currentUser: User) {
  // TODO: user NEXT_PUBLIC_API_URL
  const socket = io("http://localhost:8080", {
    withCredentials: true,
  });

  socket.on("Unauthorized", async () => {
    console.log("Unauthorized");

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

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const _socket = getSocket(currentUser);
    setSocket(_socket);
  }, [currentUser]);

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};

export const useSocket = () => useContext(EventsSocketContext);
