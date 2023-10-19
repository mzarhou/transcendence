import { create } from "zustand";

export interface CamType {
  t3D2D: boolean;
}

interface CamState extends CamType {
  set3D2D: (value: boolean) => void;
}

const camState: CamType = {
  t3D2D: true,
};

export const useCamState = create<CamState>((set) => ({
  ...camState,
  set3D2D() {
    let bool = localStorage.getItem("cam");
    if (bool == "true") set({ t3D2D: true });
    else set({ t3D2D: false });
  },
}));
