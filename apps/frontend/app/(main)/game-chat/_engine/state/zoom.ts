import { create } from "zustand";

export interface zoomType {
  z: number;
}

interface ZoomState extends zoomType {
  setZoom: (width: number) => void;
}

const zoomState: zoomType = {
  z: 545,
};

export const usezoomState = create<ZoomState>((set) => ({
  ...zoomState,
  setZoom(z: number) {
    set({ z });
  },
}));
