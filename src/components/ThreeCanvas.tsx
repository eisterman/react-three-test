import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasWidth = canvasRef.current.clientWidth;
      const canvasHeight = canvasRef.current.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(canvasWidth, canvasHeight);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;
      function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      renderer.setAnimationLoop(animate);
    }
  }, []);

  return <canvas ref={canvasRef} className='h-full w-full block'></canvas>;
}
