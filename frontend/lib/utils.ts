import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T, V>(callback: (arg: T) => V, delay = 1000) {
  let to: NodeJS.Timeout;
  return (arg: T) => {
    clearTimeout(to);
    to = setTimeout(() => {
      callback(arg);
    }, delay);
  };
}
