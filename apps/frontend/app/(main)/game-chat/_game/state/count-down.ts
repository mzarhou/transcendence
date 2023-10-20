import { UpdateGameData } from "@transcendence/db";
import { create } from "zustand";

interface CountDownState extends Pick<UpdateGameData, "countDown"> {
  setCount(count: number): void;
  reset(): void;
}

export const useCountDownState = create<CountDownState>((set) => ({
  countDown: 0,
  setCount(count: number) {
    set({ countDown: count });
  },
  reset() {
    set({ countDown: 0 });
  },
}));
