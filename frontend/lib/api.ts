"use client";

import { env } from "@/env/client.mjs";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(null, (error: AxiosError) => {
  /**
   * check if 2FA required
   */
  const wwwAuthHeader: string | undefined =
    error.response?.headers?.["www-authenticate"];
  if (
    wwwAuthHeader?.toLocaleLowerCase().includes("2fa") &&
    window.location.pathname != "/2fa"
  ) {
    window.location.href = "/2fa";
    return Promise.resolve();
  }

  /**
   * refreshing tokens if status code is 401
   */
  if (error.response?.status !== 401) {
    return Promise.reject(error);
  }

  return axios.post("/api/auth/refresh-tokens").then(() => {
    // rerun original request
    return axios.request(error.config!);
  });
});
