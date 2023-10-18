import { BoardType } from "@transcendence/db";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { create } from "zustand";

export enum COURT {
  BBLACK = "/board_black.png",
  BBLUE = "/board_blue.png",
  BGREEN = "/board_green.png",
  BORANGE = "/board_orange.png",
}

interface BoardState extends BoardType {
  setTexture: () => void;
}

const boardState: BoardType = {
  posi: [0, 0, 0],
  size: [600, 800],
  txtu: COURT.BORANGE,
};

export const useBoardState = create<BoardState>((set) => ({
  ...boardState,
  setTexture() {
    let texture = localStorage.getItem("court");
    if (texture) set({ txtu: texture });
    else set({ txtu: COURT.BORANGE });
  },
}));
