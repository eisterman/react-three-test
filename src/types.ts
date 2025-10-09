import { type Euler } from 'three';

export type Location = {
  lat: number;
  lon: number;
};

export type Rectangle = {
  south: number;
  north: number;
  east: number;
  west: number;
};

export type Cube = {
  position: [x: number, y: number, z: number];
  rotation: Euler;
};

export type Project = {
  remoteUid: string | null;
  mapRectangle: Rectangle | null;
  cubes: (Cube & { uid: string })[];
};

export type SavedProject = Project & { remoteUid: string };

export function isSavedproject(project: Project): project is SavedProject {
  return project.remoteUid !== null;
}
