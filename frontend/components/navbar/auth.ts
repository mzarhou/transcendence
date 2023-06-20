"use server";

import { get42RedirectUri } from "@/lib/$42";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async () => {
  redirect(get42RedirectUri());
};

export const logout = async () => {
  cookies().set("accessToken", "", { maxAge: -1 });
  cookies().set("refreshToken", "", { maxAge: -1 });
  revalidatePath("/");
};
