type HistoryItem = {
  expression: string
  result: string
}

export type CalculatorStore = {
  history: HistoryItem[]
  addHistory: (item: HistoryItem) => void
  clearHistory: () => void
}