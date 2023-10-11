import { create } from "zustand";

export interface ballType {
  position: [x: number, y: number, z: number];
  size: [radius: number, width: number, height: number];
  color: string;
}

interface BallState extends ballType {
  setPosition: (data: { x: number; y: number; z: number }) => void;
}

export const useBallState = create<BallState>((set) => ({
  position: [0, 0, 20],
  size: [20, 15, 15],
  color: "white",

  setPosition(data: { x: number; y: number; z: number }) {
    set({ position: [data.x, data.y, data.z] });
  },
}));
