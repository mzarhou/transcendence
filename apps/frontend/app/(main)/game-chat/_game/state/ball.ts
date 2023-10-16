import { BallType } from "@transcendence/db";
import { create } from "zustand";

interface BallState extends BallType {
  setPosition: (data: { x: number; y: number; z: number }) => void;
  reset: () => void;
}

const ballState: BallType = {
  posi: [0, 0, 20],
  size: [20, 15, 15],
  txtu: "white",
};

export const useBallState = create<BallState>((set) => ({
  ...ballState,
  setPosition(data: { x: number; y: number; z: number }) {
    set({ posi: [data.x, data.y, data.z] });
  },
  reset: () => {
    set(ballState);
  },
}));
