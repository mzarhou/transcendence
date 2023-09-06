"use client";

import { api } from "@/lib/api";
import { CurrentUser } from "@transcendence/common";
import { createContext, FC, useContext } from "react";
import useSWR, { SWRResponse } from "swr";

type UserContextType = Pick<
  SWRResponse<CurrentUser, any, any>,
  "data" | "isLoading" | "error"
>;

const UserContext = createContext<
  Omit<UserContextType, "data"> & { user: UserContextType["data"] }
>({
  user: undefined,
  isLoading: false,
  error: undefined,
});

interface UserProviderProps {
  children: React.ReactNode;
}

async function fetchUser(endpoint: string) {
  const { data } = await api.get<CurrentUser>(endpoint);
  return data;
}

export const USER_KEY = "/users/me";

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const userData = useSWR(USER_KEY, fetchUser, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });

  return (
    <UserContext.Provider
      value={{ ...userData, user: userData.error ? undefined : userData.data }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
