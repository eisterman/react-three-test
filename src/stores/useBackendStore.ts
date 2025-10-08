import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Cube, Rectangle } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';

export type Project = {
  mapRectangle: Rectangle | null;
  cubes: (Cube & { uid: string })[];
};

export default create(
  combine(
    {
      projects: {} as Record<string, Project>,
    },
    (set, get) => ({
      getByUid: (uid: string): Project => get().projects[uid],
      saveNewProject: (project: Project): string => {
        const uid = uuidv4();
        set((state) => ({ projects: { ...state.projects, [uid]: project } }));
        return uid;
      },
      overwriteProject: (uid: string, project: Project) =>
        set((state) => ({ projects: { ...state.projects, [uid]: project } })),
      deleteProject: (uid: string) =>
        set((state) => {
          const { [uid]: _, ...rest } = state.projects;
          return { projects: rest };
        }),
    }),
  ),
);
