import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import type { Mesh } from 'three';

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
      <Grid cellColor={'white'} sectionColor={'red'} infiniteGrid />
      <OrbitControls makeDefault />
    </Canvas>
  );
}
