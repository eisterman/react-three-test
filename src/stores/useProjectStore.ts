import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Rectangle, Cube, Project, TObject } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

// Remember that you CANNOT MODIFY IN-PLACE state during a set
export const useProjectStore = create(
  combine(
    {
      remoteUid: null as string | null,
      mapRectangle: null as Rectangle | null,
      cubes: [] as (Cube & { uid: string })[],
      tobjs: [] as (TObject & { uid: string })[],
    },
    (set, get, store) => ({
      reset: () => set(store.getInitialState()),
      getProject: (): Project => {
        const state = get();
        return { mapRectangle: state.mapRectangle, cubes: state.cubes, remoteUid: state.remoteUid };
      },
      setProject: (project: Project) =>
        set(() => ({
          mapRectangle: project.mapRectangle,
          cubes: project.cubes,
          remoteUid: project.remoteUid,
        })),
      setMapRectangle: (mapRectangle: Rectangle | null) => set(() => ({ mapRectangle })),
      // TObjects
      addTObject: (tobj: TObject) => {
        const uid = uuidv4();
        set((state) => {
          if (
            state.tobjs.find(
              (v) => _.isEqual(v.position, tobj.position) && v.rotation.equals(tobj.rotation),
            )
          )
            return {};
          return { tobjs: [...state.tobjs, { ...tobj, uid: uid }] };
        });
        return uid;
      },
      updateTObject: (uid: string, tobj: TObject) =>
        set((state) => ({
          tobjs: state.tobjs.map((v) => (v.uid === uid ? { ...tobj, uid: uid } : v)),
        })),
      removeTObject: (uid: string) =>
        set((state) => ({ tobjs: state.tobjs.filter((v) => v.uid !== uid) })),
      // Cube
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
