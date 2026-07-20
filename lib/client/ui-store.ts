"use client";

import { create } from "zustand";

export type AppView = "pulse" | "data" | "imports";
export type TrendRange = "six" | "twelve" | "all";

interface UiState {
  activeView: AppView;
  selectedPeriod: string | null;
  trendRange: TrendRange;
  importOpen: boolean;
  setActiveView: (view: AppView) => void;
  setSelectedPeriod: (period: string) => void;
  setTrendRange: (range: TrendRange) => void;
  openImport: () => void;
  closeImport: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeView: "pulse",
  selectedPeriod: null,
  trendRange: "six",
  importOpen: false,
  setActiveView: (activeView) => set({ activeView }),
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  setTrendRange: (trendRange) => set({ trendRange }),
  openImport: () => set({ importOpen: true }),
  closeImport: () => set({ importOpen: false }),
}));
