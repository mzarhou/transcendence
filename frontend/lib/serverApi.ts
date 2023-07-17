"use server";

import { env } from "@/env/server.mjs";
import axios from "axios";

export const serverApi = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
