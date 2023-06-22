"use server";

import { get42RedirectUri } from "@/lib/$42";
import { redirect } from "next/navigation";

export const school42login = async () => {
  redirect(get42RedirectUri());
};
