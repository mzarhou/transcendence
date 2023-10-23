"use client";

import { create } from "zustand";

interface MatchState {
  matchId: number;
  homeId: number;
  adversaryId: number;
  winnerId: number | null;
}

const matchState = {
  matchId: 0,
  homeId: 0,
  adversaryId: 0,
  winnerId: null,
};

export const useMatchState = create<
  MatchState & {
    setState: (newState: Partial<MatchState>) => void;
    reset: () => void;
  }
>((set) => ({
  ...matchState,
  setState: (newState) => set(newState),
  reset: () => set(matchState),
}));
