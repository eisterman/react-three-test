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
