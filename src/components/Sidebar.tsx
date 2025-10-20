import clsx from 'clsx';
import { type ChangeEvent, type FormEvent, useId, useRef, useState } from 'react';
import PlaceDialog from '@/components/PlaceDialog.tsx';
import { useProjectStore } from '@/stores/useProjectStore.ts';
import { Euler } from 'three';
import { TestArea } from '@/components/TestArea.tsx';
import type { TObjType } from '@/types.ts';

function CreateTossoBtnDialog() {
  const formId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null!);
  const [modelState, setModelState] = useState<TObjType | 'empty'>('empty');
  const addTObject = useProjectStore((state) => state.addTObject);

  function onChangeModelState(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === 'tossoeco') setModelState('tossoeco');
    else if (e.target.value === 'tossoeasy') setModelState('tossoeasy');
    else setModelState('empty');
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (modelState === 'empty') return;
    addTObject({
      objType: modelState,
      position: [0, 0, 0],
      rotation: new Euler(),
    });
    dialogRef.current.close();
  }

  return (
    <>
      <button className='btn btn-success' onClick={() => dialogRef.current.showModal()}>
        New Tosso
      </button>
      <dialog ref={dialogRef} className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <h3 className='font-bold text-lg'>New Tosso</h3>
          <p className='py-4'>Choose the model</p>
          <form id={formId} className={'flex flex-row gap-2 w-full'} onSubmit={onSubmit}>
            <select className='select' value={modelState} onChange={onChangeModelState}>
              <option disabled={true} value='empty'>
                TOSSO Model
              </option>
              <option value='tossoeco'>TOSSO Eco S 2x1</option>
              <option value='tossoeasy'>TOSSO Easy</option>
            </select>
          </form>
          <div className='modal-action'>
            <button form={formId} type='submit' className={'btn'} disabled={modelState === 'empty'}>
              Search
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const placeDialog = useRef<HTMLDialogElement>(null!);
  const addCube = useProjectStore((state) => state.addCube);
  const removeCube = useProjectStore((state) => state.removeCube);
  const cubes = useProjectStore((state) => state.cubes);
  return (
    <div className={clsx('bg-base-200', className)}>
      <div className={'flex flex-row flex-wrap items-center justify-center gap-2 my-2 border py-2'}>
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
      <div className={'flex flex-row flex-wrap items-center justify-center gap-2 my-2 border py-2'}>
        <CreateTossoBtnDialog />
        <button
          className='btn btn-error'
          onClick={() => {
            if (cubes.length > 0) {
              removeCube(cubes[0].uid);
            }
          }}
        >
          Delete Tosso (TODO)
        </button>
      </div>
      <PlaceDialog ref={placeDialog} />
      <TestArea />
    </div>
  );
}
