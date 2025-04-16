import { create } from "zustand";

interface TaskCounts {
  caring: number;
  harvesting: number;
  inspecting: number;
  packaging: number;
}

interface TaskStore {
  counts: TaskCounts;
  setCount: (type: keyof TaskCounts, count: number) => void;
  incrementCount: (type: keyof TaskCounts) => void;
  decrementCount: (type: keyof TaskCounts) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  counts: {
    caring: 0,
    harvesting: 0,
    inspecting: 0,
    packaging: 0,
  },
  setCount: (type, count) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: count,
      },
    })),
  incrementCount: (type) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: state.counts[type] + 1,
      },
    })),
  decrementCount: (type) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: Math.max(0, state.counts[type] - 1),
      },
    })),
}));
