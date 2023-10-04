import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function log(...data: any[]) {
  console.log(`[${dayjs().format("HH:mm:ss")}]`, ...data);
}

export function getServerMessage(error: any, defaultMessage: string) {
  if (error instanceof AxiosError) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.length > 0) {
      defaultMessage = serverMessage;
    }
  }
  return defaultMessage;
}

export function truncateText(str: string, maxlength: number) {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str;
}
