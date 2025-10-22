import { createFileRoute } from '@tanstack/react-router';
import ThreeCanvas from '@/components/ThreeCanvas.tsx';
import { Sidebar } from '@/components/Sidebar.tsx';
import { Activity, useState } from 'react';
import clsx from 'clsx';

export const Route = createFileRoute('/')({
  component: Index,
});

function Navbar() {
  return (
    <div className='navbar bg-base-100 shadow-lg flex flex-row justify-between'>
      <div className='navbar-start'>
        <a className='btn btn-ghost text-xl'>Visual Tosso</a>
      </div>
      <div className='navbar-end'>
        <ul className='menu menu-horizontal bg-base-200 rounded-box'>
          <li>
            <details className='dropdown dropdown-end'>
              <summary>User: rodolfo</summary>
              <ul className='menu dropdown-content  bg-base-100 rounded-t-none p-2'>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Index() {
  const [sidebarShow, setSidebarShow] = useState<boolean>(true);
  const sidebarMode = sidebarShow ? 'visible' : 'hidden';
  const canvasW = sidebarShow ? 'h-1/2 md:h-auto md:w-4/5' : 'h-full md:h-auto md:w-full';
  const sideW = sidebarShow ? 'h-1/2 md:h-auto md:w-1/5' : '';
  // FIXME: MOBILE: Quando il sidebar content overflowa lo "spessore" del bottone viene sottratto all'altezza della sidebar
  return (
    <div className={'flex flex-col h-full w-full'}>
      <Navbar></Navbar>
      <div className={'h-full w-full flex flex-col md:flex-row'}>
        <div className={clsx('relative z-0', canvasW)}>
          <ThreeCanvas></ThreeCanvas>
        </div>
        <div className={clsx('relative z-10', sideW)}>
          <Activity mode={sidebarMode}>
            <Sidebar className='h-full'></Sidebar>
          </Activity>
          <button
            className={
              'btn btn-primary absolute -top-10 right-10 md:right-auto md:-left-10 md:top-4 z-10'
            }
            onClick={() => setSidebarShow((p) => !p)}
          >
            S
          </button>
        </div>
      </div>
    </div>
  );
}
