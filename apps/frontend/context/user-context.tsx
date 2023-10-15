"use client";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { CurrentUser } from "@transcendence/db";
import { useRouter } from "next/navigation";
import { createContext, FC, useContext, useEffect, useState } from "react";

const UserContext = createContext<{
  user: CurrentUser | undefined;
  isLoading: boolean;
  refresh: () => void;
}>({
  user: undefined,
  isLoading: false,
  refresh: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

async function fetchUser() {
  const { data } = await api.get<CurrentUser>("/users/me");
  return data;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | undefined>();
  const [isLoading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchUser();
      setUser(data);
    } catch (error) {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isFirstSignIn) {
      toast({ description: "Change your nickname and profile image" });
      router.push("/settings");
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refresh }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
