import { create } from 'zustand';
export const useAppStore = create((set) => ({
  position: [0, 0, 0],
  setPosition: (position: [number, number, number]) => set(() => ({ position })),
}));
