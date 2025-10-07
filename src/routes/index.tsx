import { createFileRoute } from '@tanstack/react-router';
import ThreeCanvas from '@/components/ThreeCanvas.tsx';
import { Sidebar } from '@/components/Sidebar.tsx';

export const Route = createFileRoute('/')({
  component: Index,
});

function Navbar() {
  return (
    <div className='navbar bg-base-100 shadow-lg flex flex-row justify-between'>
      <div className='navbar-start'>
        <a className='btn btn-ghost text-xl'>React Three.js Test</a>
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
  return (
    <div className={'flex flex-col h-full w-full'}>
      <Navbar></Navbar>
      <div className={'h-full w-full flex flex-row'}>
        <div className={'flex-4'}>
          <ThreeCanvas></ThreeCanvas>
        </div>
        <Sidebar className={'flex-1'}></Sidebar>
      </div>
    </div>
  );
}
