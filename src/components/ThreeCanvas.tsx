import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function RotatingCube({ position }: { position: [number, number, number] }) {
  const myMesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    myMesh.current!.rotation.x += 0.01;
    myMesh.current!.rotation.y += 0.01;
  });
  return (
    <mesh ref={myMesh} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={0x00ff00} flatShading={true} />
    </mesh>
  );
}

export default function ThreeCanvas() {
  return (
    <Canvas>
      <directionalLight position={[0, 0, 5]} />
      <RotatingCube position={[0, 0, 0]} />
    </Canvas>
  );
}
