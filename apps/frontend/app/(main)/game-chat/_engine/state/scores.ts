import { create } from "zustand";

export interface ScoreType {
  home: number;
  adversary: number;
}

interface ScoreState extends ScoreType {
  setHomeScore: (home: number) => void;
  setAdversary: (adversary: number) => void;
  reset: () => void;
}

const scoreState: ScoreType = {
  home: 0,
  adversary: 0,
};

export const useScoreState = create<ScoreState>((set) => ({
  ...scoreState,
  setHomeScore(home: number) {
    set({ home });
  },
  setAdversary(adversary: number) {
    set({ adversary });
  },
  reset: () => {
    set(scoreState);
  },
}));
