import { create } from "zustand";

export interface ScoreType {
  home: number;
  adversary: number;
}

interface ScoreState extends ScoreType {
  setHomeScore: (home: number) => void;
  setAdversary: (adversary: number) => void;
}

export const useScoreState = create<ScoreState>((set) => ({
  home: 0,
  adversary: 0,
  setHomeScore(home: number) {
    set({ home });
  },
  setAdversary(adversary: number) {
    set({ adversary });
  },
}));
