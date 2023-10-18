import { BoardType } from "@transcendence/db";
import { create } from "zustand";

export enum COURT {
  BBLACK = "/board_black.png",
  BBLUE = "/board_blue.png",
  BGREEN = "/board_green.png",
  BORANGE = "/board_orange.png",
}

interface BoardState extends BoardType {
  setTexture: (txtu: { txtu: string }) => void;
}

const boardState: BoardType = {
  posi: [0, 0, 0],
  size: [600, 800],
  txtu: COURT.BORANGE,
};

export const useBoardState = create<BoardState>((set) => ({
  ...boardState,
  setTexture(txtu: { txtu: string }) {
    set(txtu);
  },
}));
