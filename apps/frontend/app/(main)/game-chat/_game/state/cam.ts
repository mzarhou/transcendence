import { create } from "zustand";

export interface CamType {
  twoD: boolean;
  threeD: boolean;
}

interface CamState extends CamType {
  set2D: (value: boolean) => void;
  set3D: (value: boolean) => void;
}

const camState: CamType = {
  twoD: true,
  threeD: false,
};

export const useCamState = create<CamState>((set) => ({
  ...camState,
  set2D(value: boolean) {
    set({ twoD: value });
  },
  set3D(value: boolean) {
    set({ threeD: value });
  },
}));
