import ThreeCanvas from '@/components/ThreeCanvas.tsx';
import { Sidebar } from '@/components/Sidebar.tsx';

function Navbar() {
  return (
    <div className='navbar bg-base-100 shadow-lg'>
      <a className='btn btn-ghost text-xl'>React Three.js Test</a>
    </div>
  );
}

function App() {
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

export default App;
