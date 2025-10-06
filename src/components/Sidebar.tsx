import clsx from 'clsx';
import { useRef } from 'react';
import PlaceDialog from '@/components/PlaceDialog.tsx';

export function Sidebar({ className }: { className?: string }) {
  const placeDialog = useRef<HTMLDialogElement>(null!);
  return (
    <div className={clsx('bg-base-200', className)}>
      <div className={'flex flex-col items-center gap-2 my-2'}>
        <button className='btn btn-success' onClick={() => placeDialog.current.showModal()}>
          Select Place
        </button>
        <PlaceDialog ref={placeDialog} />
        <button className='btn btn-success'>Test</button>
      </div>
    </div>
  );
}
