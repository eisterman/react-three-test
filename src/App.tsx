import ThreeCanvas from '@/components/ThreeCanvas.tsx';

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
      <ThreeCanvas></ThreeCanvas>
    </div>
  );
}

export default App;
