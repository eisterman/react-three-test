import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Gltf, Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { BoxGeometry, Euler, type Group, Texture, TextureLoader } from 'three';
import { useProjectStore } from '@/stores/useProjectStore.ts';
import type { Cube, Rectangle, TObject } from '@/types.ts';
import tossoEasyUrl from '@/assets/models/tossoeasy-sp.glb?url';

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
    if (mapRectangle === null) {
      setTexture(null);
    } else {
      fetchMapObjUrl(mapRectangle)
        .then((url) => {
          const loader = new TextureLoader();
          setTexture(loader.load(url));
        })
        .catch((err) => console.error(err));
    }
  }, [mapRectangle]);

  return texture === null ? null : (
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    );
}

function RotatingCube({ cube }: { cube: Cube & { uid: string } }) {
  const [mode, setMode] = useState<'translate' | 'rotate' | null>(null);
  const myGroup = useRef<Group>(null!);
  const updateCube = useProjectStore((state) => state.updateCube);

  function rotateMode() {
    if (mode == 'translate') {
      setMode('rotate');
    } else if (mode == 'rotate') {
      setMode(null);
    } else {
      setMode('translate');
    }
  }
  return (
    <>
      {mode !== null && (
        <TransformControls
          object={myGroup}
          mode={mode ?? undefined}
          onObjectChange={() => {
            if (myGroup.current) {
              updateCube(cube.uid, {
                position: myGroup.current.position.toArray(),
                rotation: myGroup.current.rotation,
              });
            }
          }}
        />
      )}
      <group ref={myGroup} position={cube.position} rotation={cube.rotation}>
        <mesh onContextMenu={rotateMode}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhongMaterial color={0x00ff00} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color='black' />
        </lineSegments>
      </group>
    </>
  );
}

function TossoTest({ tobj }: { tobj: TObject & { uid: string } }) {
  const [mode, setMode] = useState<'translate' | 'rotate' | null>(null);
  const myGroup = useRef<Group>(null!);
  function rotateMode() {
    if (mode == 'translate') {
      setMode('rotate');
    } else if (mode == 'rotate') {
      setMode(null);
    } else {
      setMode('translate');
    }
  }
  return (
    <>
      {mode !== null && (
        <TransformControls
          object={myGroup}
          mode={mode ?? undefined}
          showX={mode !== 'rotate'}
          showY={mode === 'rotate'}
          showZ={mode !== 'rotate'}
          // onObjectChange={() => {
          //   if (myGroup.current) {
          //     updateCube(cube.uid, {
          //       position: myGroup.current.position.toArray(),
          //       rotation: myGroup.current.rotation,
          //     });
          //   }
          // }}
        />
      )}
      <Gltf
        ref={myGroup}
        src={tossoEasyUrl}
        onContextMenu={rotateMode}
        position={tobj.position}
        rotation={tobj.rotation}
      ></Gltf>
    </>
  );
}

export default function ThreeCanvas() {
  const cubes = useProjectStore((state) => state.cubes);
  const test: TObject & { uid: string } = {
    objType: 'tossoeasy',
    position: [0, 0, 0],
    rotation: new Euler(),
    uid: '123',
  };
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
      {cubes.map((cube) => (
        <RotatingCube cube={cube} key={cube.uid} />
      ))}
      <TossoTest tobj={test} />
      <MapBase />
      <directionalLight position={[5, 5, 5]} />
      <ambientLight intensity={0.3} />
      <Grid cellColor={'white'} sectionColor={'red'} infiniteGrid />
      <OrbitControls makeDefault />
    </Canvas>
  );
}
