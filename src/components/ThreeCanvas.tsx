import { Suspense, use, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Gltf, Grid, TransformControls } from '@react-three/drei';
import { BoxGeometry, type Group, Texture, TextureLoader } from 'three';
import { useProjectStore } from '@/stores/useProjectStore.ts';
import type { Cube, Rectangle, TObject, TObjType } from '@/types.ts';
import tossoEasyUrl from '@/assets/models/tossoeasy-sp.glb?url';
import tossoEcoUrl from '@/assets/models/tosso_eco_S-2x1.glb?url';
import CanvasLoading from '@/components/CanvasLoading.tsx';
import L from 'leaflet';

// Preload models to prevent strange re-rendering at a model load
// useGLTF.preload(tossoEasyUrl);
// useGLTF.preload(tossoEcoUrl);

async function fetchMapTexture(l: Rectangle) {
  const mapStyle = 'satellite-v9'; // or 'satellite-streets-v12'
  // TODO Use Protected Token for live
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const bbox = `[${l.west},${l.south},${l.east},${l.north}]`; // [lon(min),lat(min),lon(max),lat(max)]
  const url = `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${bbox}/1280x1280?access_token=${accessToken}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Failed to fetch image');
  const blob = await resp.blob();
  const resUrl = URL.createObjectURL(blob);
  const loader = new TextureLoader();
  return loader.loadAsync(resUrl);
}

function calculateMaxMeters(mapRectangle: Rectangle) {
  const bounds = L.latLngBounds(
    L.latLng(mapRectangle.south, mapRectangle.west),
    L.latLng(mapRectangle.north, mapRectangle.east),
  );
  const widthMeters = bounds.getSouthWest().distanceTo(bounds.getSouthEast());
  const heightMeters = bounds.getSouthWest().distanceTo(bounds.getNorthWest());
  return Math.max(widthMeters, heightMeters);
}

function MapRender({
  texturePromise,
  sideMeters,
}: {
  texturePromise: Promise<Texture>;
  sideMeters: number;
}) {
  const texture = use(texturePromise);
  return (
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[sideMeters, sideMeters]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// For unknown reasons, I cannot do `use(fetchMapTexture())` with inline Promise because it triggers an infinite reload
function MapBase() {
  const mapRectangle = useProjectStore((state) => state.mapRectangle);
  const texturePromise: Promise<Texture> | null = mapRectangle && fetchMapTexture(mapRectangle);
  const maxMeters = mapRectangle && calculateMaxMeters(mapRectangle);

  return (
    <Suspense fallback={<CanvasLoading />}>
      {texturePromise && maxMeters && (
        <MapRender texturePromise={texturePromise} sideMeters={maxMeters} />
      )}
    </Suspense>
  );
}

function MapGrid() {
  const mapRectangle = useProjectStore((state) => state.mapRectangle);
  const fadeDistance = mapRectangle ? calculateMaxMeters(mapRectangle) + 10 : 100;
  return <Grid infiniteGrid fadeDistance={fadeDistance} fadeFrom={0} />;
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
          onMouseUp={() => {
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

function getModelUrl(tot: TObjType): string {
  if (tot === 'tossoeasy') return tossoEasyUrl;
  else if (tot === 'tossoeco') return tossoEcoUrl;
  else throw new Error('Invalid TObjType');
}

function TossoModelObject({ tobj }: { tobj: TObject & { uid: string } }) {
  const [mode, setMode] = useState<'translate' | 'rotate' | null>(null);
  const myGroup = useRef<Group | null>(null!);
  const modelUrl = getModelUrl(tobj.objType);
  const updateTObject = useProjectStore((state) => state.updateTObject);

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
    <Suspense fallback={<CanvasLoading />}>
      {myGroup.current !== null && mode !== null && (
        <TransformControls
          object={myGroup.current}
          mode={mode ?? undefined}
          showX={mode !== 'rotate'}
          showY={mode === 'rotate'}
          showZ={mode !== 'rotate'}
          onMouseUp={() => {
            if (myGroup.current) {
              updateTObject(tobj.uid, {
                position: myGroup.current.position.toArray(),
                rotation: myGroup.current.rotation,
                objType: tobj.objType,
              });
            }
          }}
        />
      )}
      <Gltf
        ref={myGroup}
        src={modelUrl}
        onContextMenu={rotateMode}
        position={tobj.position}
        rotation={tobj.rotation}
      ></Gltf>
    </Suspense>
  );
}

function TossoModels() {
  const tossos = useProjectStore((state) => state.tobjs);
  return (
    <>
      {tossos.map((tobj) => (
        <TossoModelObject tobj={tobj} key={tobj.uid} />
      ))}
    </>
  );
}

export default function ThreeCanvas() {
  const cubes = useProjectStore((state) => state.cubes);
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
      {cubes.map((cube) => (
        <RotatingCube cube={cube} key={cube.uid} />
      ))}
      <TossoModels />
      <MapBase />
      <directionalLight position={[5, 5, 5]} />
      <ambientLight intensity={0.3} />
      <MapGrid />
      <CameraControls makeDefault />
    </Canvas>
  );
}
