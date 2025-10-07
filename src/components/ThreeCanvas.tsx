import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { type Mesh, Texture, TextureLoader } from 'three';
import { useProjectStore } from '@/stores/useProjectStore.ts';
import type { Rectangle } from '@/types.ts';

async function fetchMapObjUrl(l: Rectangle) {
  const mapStyle = 'satellite-v9'; // or 'satellite-streets-v12'
  // TODO Use Protected Token for live
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const bbox = `[${l.west},${l.south},${l.east},${l.north}]`; // [lon(min),lat(min),lon(max),lat(max)]
  const url = `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${bbox}/800x800?access_token=${accessToken}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Failed to fetch image');
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
}

function MapBase() {
  const mapRectangle = useProjectStore((state) => state.mapRectangle);
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    if (mapRectangle === null) return;
    fetchMapObjUrl(mapRectangle)
      .then((url) => {
        const loader = new TextureLoader();
        setTexture(loader.load(url));
      })
      .catch((err) => console.error(err));
  }, [mapRectangle]);

  return texture === null ? null : (
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    );
}

function RotatingCube({ position }: { position: [number, number, number] }) {
  const [mode, setMode] = useState<'translate' | 'rotate' | undefined>(undefined);
  const myMesh = useRef<Mesh>(null!);
  useFrame(() => {
    myMesh.current.rotation.x += 0.01;
    myMesh.current.rotation.y += 0.01;
  });
  function rotateMode() {
    if (mode == 'translate') {
      setMode('rotate');
    } else if (mode == 'rotate') {
      setMode(undefined);
    } else {
      setMode('translate');
    }
  }
  return (
    <>
      {mode !== undefined && <TransformControls object={myMesh} mode={mode} />}
      <mesh ref={myMesh} position={position} onContextMenu={rotateMode}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color={0x00ff00} flatShading={true} />
      </mesh>
    </>
  );
}

export default function ThreeCanvas() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
      <directionalLight position={[5, 5, 5]} />
      <RotatingCube position={[0, 0.5, 0]} />
      <MapBase />
      <Grid cellColor={'white'} sectionColor={'red'} infiniteGrid />
      <OrbitControls makeDefault />
    </Canvas>
  );
}
