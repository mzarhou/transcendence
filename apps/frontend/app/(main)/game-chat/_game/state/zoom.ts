import { create } from "zustand";

export interface ZoomType {
  z: number;
}

interface ZoomState extends ZoomType {
  setZoom: (width: number) => void;
}

const zoomState: ZoomType = {
  z: 545,
};

export const usezoomState = create<ZoomState>((set) => ({
  ...zoomState,
  setZoom(z: number) {
    set({ z });
  },
}));
