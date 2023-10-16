import { create } from "zustand";

interface MatchState {
  matchId: number;
  homeId: number;
  adversaryId: number;
  winnerId: number | null;
}

export const useMatchState = create<
  MatchState & {
    setState: (newState: Partial<MatchState>) => void;
  }
>((set) => ({
  matchId: 0,
  homeId: 0,
  adversaryId: 0,
  winnerId: null,

  setState: (newState) => {
    set(newState);
  },
}));
