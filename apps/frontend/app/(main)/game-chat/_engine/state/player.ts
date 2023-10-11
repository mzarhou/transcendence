import { create } from "zustand";

interface PlayerType {
  id: number;
  posi: [x: number, y: number, z: number];
  size: [length: number, width: number, height: number];
  txtu: string;
}

export interface PlayerState extends PlayerType {
  setId: (id: number) => void;
  setPosition: (data: { x: number; y: number; z: number }) => void;
}

export const usePlayer2State = create<PlayerState>((set, get) => ({
  id: 0,
  posi: [0, 330, 15],
  size: [100, 10, 30],
  txtu: "blue",

  setId: (id) => set({ id }),
  setPosition(data) {
    const oldPos = get().posi;
    if (oldPos[0] === data.x && oldPos[1] === data.y && oldPos[2] === data.z)
      return;
    set({ posi: [data.x, data.y, data.z] });
  },
}));

export const usePlayer1State = create<PlayerState>((set, get) => ({
  id: 0,
  posi: [0, -330, 15],
  size: [100, 10, 30],
  txtu: "red",

  setId: (id) => set({ id }),
  setPosition(data) {
    const oldPos = get().posi;
    if (oldPos[0] === data.x && oldPos[1] === data.y && oldPos[2] === data.z)
      return;
    set({ posi: [data.x, data.y, data.z] });
  },
}));
