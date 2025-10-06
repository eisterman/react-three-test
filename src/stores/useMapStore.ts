import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Rectangle } from '@/types.ts';

export const useMapStore = create(
  combine({ mapRectangle: null as Rectangle | null }, (set) => ({
    setMapRectangle: (mapRectangle: Rectangle | null) => set(() => ({ mapRectangle })),
  })),
);
