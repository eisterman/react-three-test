import { useState } from 'react';

function Navbar() {
  return (
    <div className='navbar bg-base-100 shadow-lg'>
      <a className='btn btn-ghost text-xl'>React Three.js Test</a>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar></Navbar>
      <h1>Vite + React</h1>
      <div>
        <button className='btn' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
