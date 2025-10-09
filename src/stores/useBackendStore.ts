import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Project, SavedProject } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';

export default create(
  combine(
    {
      projects: {} as Record<string, Project>,
    },
    (set, get) => ({
      getByUid: (uid: string): Project => get().projects[uid],
      saveNewProject: (project: Project): string => {
        const uid = uuidv4();
        project.remoteUid = uid;
        set((state) => ({ projects: { ...state.projects, [uid]: project } }));
        return uid;
      },
      overwriteProject: (project: SavedProject) => {
        set((state) => ({ projects: { ...state.projects, [project.remoteUid!]: project } }));
      },
      deleteProject: (uid: string) =>
        set((state) => {
          const { [uid]: _, ...rest } = state.projects;
          return { projects: rest };
        }),
    }),
  ),
);
