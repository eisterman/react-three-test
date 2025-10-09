import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Rectangle, Cube, Project } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

// Remember that you CANNOT MODIFY IN-PLACE state during a set
export const useProjectStore = create(
  combine(
    {
      mapRectangle: null as Rectangle | null,
      cubes: [] as (Cube & { uid: string })[],
      remoteUid: null as string | null,
    },
    (set, get, store) => ({
      reset: () => set(store.getInitialState()),
      getProject: (): Project & { remoteUid: string | null } => {
        const state = get();
        return { mapRectangle: state.mapRectangle, cubes: state.cubes, remoteUid: state.remoteUid };
      },
      setProject: (project: Project, remoteUid: string | null) =>
        set(() => ({
          mapRectangle: project.mapRectangle,
          cubes: project.cubes,
          remoteUid,
        })),
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
