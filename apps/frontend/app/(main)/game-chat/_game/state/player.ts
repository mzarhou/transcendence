import { PlayerType } from "@transcendence/db";
import { create } from "zustand";

interface ExtendedPlayerType extends PlayerType {
  id: number;
}

export interface PlayerState extends ExtendedPlayerType {
  setId: (id: number) => void;
  setPosition: (data: { x: number; y: number; z: number }) => void;
  reset: () => void;
}

const player2State: ExtendedPlayerType = {
  id: 0,
  posi: [0, 330, 15],
  size: [150, 10, 30],
  txtu: "blue",
};
const player1State: ExtendedPlayerType = {
  id: 0,
  posi: [0, -330, 15],
  size: [150, 10, 30],
  txtu: "red",
};

export const usePlayer2State = create<PlayerState>((set, get) => ({
  ...player2State,
  setId: (id) => set({ id }),
  setPosition(data) {
    const oldPos = get().posi;
    if (oldPos[0] === data.x && oldPos[1] === data.y && oldPos[2] === data.z)
      return;
    set({ posi: [data.x, data.y, data.z] });
  },
  reset: () => {
    set(player2State);
  },
}));

export const usePlayer1State = create<PlayerState>((set, get) => ({
  ...player1State,
  setId: (id) => set({ id }),
  setPosition(data) {
    const oldPos = get().posi;
    if (oldPos[0] === data.x && oldPos[1] === data.y && oldPos[2] === data.z)
      return;
    set({ posi: [data.x, data.y, data.z] });
  },
  reset: () => {
    set(player1State);
  },
}));
