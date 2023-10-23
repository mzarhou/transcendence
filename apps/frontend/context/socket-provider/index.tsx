"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { env } from "@/env/client.mjs";
import useFriendsEvents from "./use-friend-events";
import { useGroupEvents } from "./use-groups-events";
import useMessagesEvents from "./use-messages-events";
import useErrorsEvents from "./use-errors-events";
import { useUser } from "../user-context";

const socket = io(env.NEXT_PUBLIC_API_URL, {
  withCredentials: true,
  autoConnect: false,
});

const EventsSocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(EventsSocketContext);

export const EventsSocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  // set events
  useFriendsEvents(socket);
  useGroupEvents(socket);
  useMessagesEvents(socket);
  useErrorsEvents(socket);

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [user]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};
