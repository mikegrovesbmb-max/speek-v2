interface HistoryItem {
  text: string;
  count: number;
  lastSpoken: number; // timestamp
}

export const useHistoryStore = defineStore('history', {
  state: () => {
    return {
      items: [] as HistoryItem[],
      maxItems: 100, // Maximum number of items to keep in history
    }
  },
  getters: {
    // Get history sorted by most recent
    recentItems: (state) => {
      return [...state.items].sort((a, b) => {
        return b.lastSpoken - a.lastSpoken
      })
    },
    // Get history sorted by most frequently used
    frequentItems: (state) => {
      return [...state.items].sort((a, b) => {
        return b.count - a.count
      })
    }
  },
  actions: {
    addToHistory(text: string): void {
      if (!text.trim()) return;

      // Check if text already exists in history
      const existingIndex = this.items.findIndex(item => item.text === text);

      if (existingIndex >= 0) {
        // Update existing item
        this.items[existingIndex].count += 1;
        this.items[existingIndex].lastSpoken = Date.now();
      } else {
        // Add new item
        this.items.push({
          text,
          count: 1,
          lastSpoken: Date.now()
        });

        // If we exceed the maximum, remove the least used items
        if (this.items.length > this.maxItems) {
          // Sort by count and remove the least used
          this.items.sort((a, b) => a.count - b.count);
          this.items.splice(0, this.items.length - this.maxItems);
        }
      }
    },
    clearHistory(): void {
      this.items = [];
    },
    removeItem(text: string): void {
      const index = this.items.findIndex(item => item.text === text);
      if (index >= 0) {
        this.items.splice(index, 1);
      }
    }
  },
  persist: [
    {
      storage: piniaPluginPersistedstate.localStorage(),
    },
    {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  ]
});
