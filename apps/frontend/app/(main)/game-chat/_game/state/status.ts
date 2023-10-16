import { create } from "zustand";

export enum STATUS {
  CONNECT = "connect",
  WAITING = "waiting",
  STRGAME = "startGame",
  UPDGAME = "update",
  GAMOVER = "GameOver",
}

interface StatusState {
  name: STATUS;
  setStatus: (name: STATUS) => void;
}

export const useStatus = create<StatusState>((set) => ({
  name: STATUS.CONNECT,
  setStatus(name) {
    set({ name });
  },
}));
