"use client";

import { api } from "@/lib/api";
import { User } from "@transcendence/common";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, FC, useContext, useEffect, useState } from "react";
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

const refreshTokens = async () => {
  await axios.post("/api/auth/refresh-tokens");
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const fetcher = async (endpoint: string): Promise<User | undefined> => {
    let error;
    try {
      const user = await fetchUser(endpoint);
      return user;
    } catch (err) {
      error = err;
    }

    if (!(error instanceof AxiosError)) throw error;

    /**
     * check if 2FA required
     */
    const wwwAuthHeader: string | undefined =
      error.response?.headers?.["www-authenticate"];
    if (
      wwwAuthHeader?.toLocaleLowerCase().includes("2fa") &&
      pathname != "/2fa"
    ) {
      router.push("/2fa");
      return undefined;
    }

    /**
     * refreshing tokens if status
     * code is 401
     * and try again
     */
    if (error.response?.status !== 401) {
      throw "Unkown error";
    }
    try {
      await refreshTokens();
      return fetchUser(endpoint);
    } catch (error) {}
    return undefined;
  };

  const userData = useSWR("/users/me", fetcher, {
    shouldRetryOnError: false,
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
