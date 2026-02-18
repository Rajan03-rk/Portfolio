import React, { useMemo, useRef } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { Canvas, useFrame } from 'https://esm.sh/@react-three/fiber@8.17.10?deps=react@18.3.1,react-dom@18.3.1,three@0.165.0';
import { Float, Sparkles, Stars } from 'https://esm.sh/@react-three/drei@9.112.0?deps=react@18.3.1,react-dom@18.3.1,three@0.165.0,@react-three/fiber@8.17.10';
import * as THREE from 'https://esm.sh/three@0.165.0';

const e = React.createElement;

function useWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function HeroCore() {
  const groupRef = useRef();
  const orbRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current || !orbRef.current) return;

    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.09;

    orbRef.current.rotation.x += delta * 0.12;
    orbRef.current.rotation.z += delta * 0.1;

    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.3;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  const ringPositions = useMemo(() => {
    const points = [];
    for (let i = 0; i < 9; i += 1) {
      const angle = (i / 9) * Math.PI * 2;
      points.push([Math.cos(angle) * 3.4, Math.sin(angle) * 1.65, Math.sin(angle * 2.3) * 1.8]);
    }
    return points;
  }, []);

  return (
    e(
      'group',
      { ref: groupRef },
      e('ambientLight', { intensity: 0.3 }),
      e('directionalLight', { position: [3, 2, 5], intensity: 1.1, color: '#7ad6ff' }),
      e('pointLight', { position: [-4, -2, 3], intensity: 1.4, color: '#58ffd5' }),
      e('pointLight', { position: [5, 4, -2], intensity: 1.1, color: '#5ca6ff' }),
      e(
        Float,
        { speed: 1.2, floatIntensity: 0.7, rotationIntensity: 0.45 },
        e(
          'mesh',
          { ref: orbRef, position: [0, 0, -0.8] },
          e('icosahedronGeometry', { args: [1.45, 4] }),
          e('meshStandardMaterial', {
            color: '#66c8ff',
            emissive: '#1f4f7e',
            emissiveIntensity: 0.65,
            roughness: 0.2,
            metalness: 0.55,
            transparent: true,
            opacity: 0.86
          })
        )
      ),
      ...ringPositions.map((position, index) =>
        e(
          Float,
          {
            key: `node-${index}`,
            speed: 1 + index * 0.04,
            floatIntensity: 1.5,
            rotationIntensity: 1.2
          },
          e(
            'mesh',
            { position },
            e('sphereGeometry', { args: [0.2 + (index % 3) * 0.04, 24, 24] }),
            e('meshStandardMaterial', {
              color: index % 2 ? '#7ff0ff' : '#6ba9ff',
              emissive: index % 2 ? '#3ca5c7' : '#2f5ab3',
              emissiveIntensity: 0.85,
              metalness: 0.5,
              roughness: 0.18
            })
          )
        )
      ),
      e(Sparkles, { count: 110, scale: [16, 9, 10], size: 2.3, speed: 0.45, opacity: 0.5, color: '#7bd8ff' }),
      e(Stars, { radius: 95, depth: 45, count: 1800, factor: 3, saturation: 0.85, fade: true, speed: 0.45 })
    )
  );
}

function App() {
  return e(
    Canvas,
    {
      camera: { position: [0, 0, 10], fov: 45 },
      dpr: [1, 1.6],
      gl: { antialias: true, alpha: true, powerPreference: 'high-performance' }
    },
    e('fog', { attach: 'fog', args: ['#030811', 13, 28] }),
    e(HeroCore)
  );
}

const rootEl = document.getElementById('webgl-root');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (rootEl && useWebGL() && !prefersReducedMotion) {
  createRoot(rootEl).render(e(App));
}
