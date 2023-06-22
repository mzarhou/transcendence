"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export const getUser = async () => {
  try {
    const token = cookies().get("accessToken")?.value;
    const { data } = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {}
  return null;
};
