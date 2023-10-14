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
  reset: () => void;
}

const player2State: PlayerType = {
  id: 0,
  posi: [0, 330, 15],
  size: [100, 10, 30],
  txtu: "blue",
};
const player1State: PlayerType = {
  id: 0,
  posi: [0, -330, 15],
  size: [100, 10, 30],
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