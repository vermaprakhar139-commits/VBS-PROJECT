import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: "vbs-theme" }
  )
);