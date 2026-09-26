import { create } from 'zustand'
import type { CalculatorStore } from './types'

export const useCalculatorStore = create<CalculatorStore>((set) => ({
    history: [],
    addHistory: (item) => set((state) => ({ history: [...state.history, item] })),
    clearHistory: () => set({ history: [] }),
}))
