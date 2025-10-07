import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Rectangle, Cube } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

// Remember that you CANNOT MODIFY IN-PLACE state during a set
export const useProjectStore = create(
  combine(
    { mapRectangle: null as Rectangle | null, cubes: [] as (Cube & { uid: string })[] },
    (set) => ({
      setMapRectangle: (mapRectangle: Rectangle | null) => set(() => ({ mapRectangle })),
      updateCube: (cubeUid: string, cube: Cube) =>
        set((state) => {
          return {
            cubes: state.cubes.map((v) => (v.uid === cubeUid ? { ...cube, uid: cubeUid } : v)),
          };
        }),
      addCube: (cube: Cube) =>
        set((state) => {
          if (
            state.cubes.find(
              (v) => _.isEqual(v.position, cube.position) && v.rotation.equals(cube.rotation),
            )
          )
            return {};
          return { cubes: [...state.cubes, { ...cube, uid: uuidv4() }] };
        }),
      removeCube: (cubeUid: string) =>
        set((state) => {
          return { cubes: state.cubes.filter((v) => v.uid !== cubeUid) };
        }),
    }),
  ),
);
