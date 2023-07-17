"use client";

import { api } from "@/lib/api";
import { User } from "@transcendence/common";
import { createContext, FC, useContext } from "react";
import useSWR, { SWRResponse } from "swr";

type UserContextType = Pick<
  SWRResponse<User, any, any>,
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
  const { data } = await api.get<User>(endpoint);
  return data;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const userData = useSWR("/users/me", fetchUser, {
    revalidateOnFocus: false,
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
