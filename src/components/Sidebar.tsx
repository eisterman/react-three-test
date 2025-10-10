import clsx from 'clsx';
import { useRef } from 'react';
import PlaceDialog from '@/components/PlaceDialog.tsx';
import { useProjectStore } from '@/stores/useProjectStore.ts';
import { Euler } from 'three';
import { TestArea } from '@/components/TestArea.tsx';

export function Sidebar({ className }: { className?: string }) {
  const placeDialog = useRef<HTMLDialogElement>(null!);
  const addCube = useProjectStore((state) => state.addCube);
  const removeCube = useProjectStore((state) => state.removeCube);
  const cubes = useProjectStore((state) => state.cubes);
  return (
    <div className={clsx('bg-base-200', className)}>
      <div className={'flex flex-row flex-wrap items-center justify-center gap-2 my-2'}>
        <button className='btn btn-info' onClick={() => placeDialog.current.showModal()}>
          Select Place
        </button>
        <button
          className='btn btn-success'
          onClick={() => {
            addCube({
              position: [0, 0.5, 0],
              rotation: new Euler(),
            });
          }}
        >
          Create Cube
        </button>
        <button
          className='btn btn-error'
          onClick={() => {
            if (cubes.length > 0) {
              removeCube(cubes[0].uid);
            }
          }}
        >
          Delete Cube
        </button>
      </div>
      <PlaceDialog ref={placeDialog} />
      <TestArea />
    </div>
  );
}
