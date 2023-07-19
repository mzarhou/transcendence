import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function log(...data: any[]) {
  console.log(`[${dayjs().format("HH:mm:ss")}]`, ...data);
}
