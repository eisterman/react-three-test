import { Html, useProgress } from '@react-three/drei';
import type { CSSProperties } from 'react';

export default function CanvasLoading() {
  const { progress } = useProgress();
  const intProg = Number(progress).toFixed(0);
  return (
    <Html fullscreen>
      <div className='bg-black/50 h-full w-full flex justify-center items-center'>
        <div className='bg-base-100 rounded-xl shadow-xl p-2'>
          <div className='radial-progress' style={{ '--value': intProg } as CSSProperties}>
            {intProg}%
          </div>
        </div>
      </div>
    </Html>
  );
}
