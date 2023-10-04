"use client";

import { env } from "@/env/client.mjs";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * check if 2FA required
 */
api.interceptors.response.use(null, (error: AxiosError) => {
  const wwwAuthHeader: string | undefined =
    error.response?.headers?.["www-authenticate"];
  if (
    wwwAuthHeader?.toLocaleLowerCase().includes("2fa") &&
    window.location.pathname != "/2fa"
  ) {
    window.location.href = "/2fa";
  }
  return Promise.reject(error);
});

/**
 * refresh tokens
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const res = error.response;

    if (
      res?.status === 401 &&
      res.config &&
      !(res.config as any).__isRetryRequest
    ) {
      return new Promise(async (resolve, reject) => {
        try {
          await api.post("/authentication/refresh-tokens");
          (error.config as any).__isRetryRequest = true;
          resolve(api(error.config!));
        } catch (error) {
          console.log("Failed to refresh token");
          reject(error);
        }
      });
    }

    return Promise.reject(error);
  },
);
