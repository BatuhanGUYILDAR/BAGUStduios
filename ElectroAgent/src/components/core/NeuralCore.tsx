import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { AiState, ExecutionState } from '../../types';

const stateColors: Record<AiState, string> = {
  online: '#16f2b3',
  thinking: '#f8c14a',
  error: '#ff4d65',
};

function ParticleCloud({ state }: { state: AiState }) {
  const points = useRef<THREE.Points>(null);
  const color = stateColors[state];
  const positions = useMemo(() => {
    const count = 1200;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 1.25 + Math.random() * 2.65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      values[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      values[index * 3 + 2] = radius * Math.cos(phi);
    }
    return values;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) {
      return;
    }
    const speed = state === 'thinking' ? 0.22 : state === 'error' ? 0.08 : 0.12;
    points.current.rotation.y = clock.elapsedTime * speed;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.22) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.018} transparent opacity={0.78} depthWrite={false} />
    </points>
  );
}

function ReactorSphere({ state }: { state: AiState }) {
  const mesh = useRef<THREE.Mesh>(null);
  const color = stateColors[state];

  useFrame(({ clock }) => {
    if (!mesh.current) {
      return;
    }
    const pulse = state === 'thinking' ? 0.12 : state === 'error' ? 0.06 : 0.04;
    const scale = 1 + Math.sin(clock.elapsedTime * 3.4) * pulse;
    mesh.current.scale.setScalar(scale);
    mesh.current.rotation.y = clock.elapsedTime * 0.16;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.05, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={state === 'thinking' ? 1.7 : 1.1}
        roughness={0.26}
        metalness={0.64}
        wireframe
      />
    </mesh>
  );
}

function OrbitalRing({ radius, tilt, speed, state }: { radius: number; tilt: number; speed: number; state: AiState }) {
  const ring = useRef<THREE.Mesh>(null);
  const color = stateColors[state];

  useFrame(({ clock }) => {
    if (!ring.current) {
      return;
    }
    ring.current.rotation.z = clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ring} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 10, 160]} />
      <meshBasicMaterial color={color} transparent opacity={0.74} />
    </mesh>
  );
}

function NeuralScene({ state }: { state: AiState }) {
  return (
    <>
      <color attach="background" args={['#020504']} />
      <ambientLight intensity={0.38} />
      <pointLight position={[3, 4, 6]} intensity={2.8} color={stateColors[state]} />
      <pointLight position={[-4, -2, -4]} intensity={1.2} color="#33b7ff" />
      <ParticleCloud state={state} />
      <ReactorSphere state={state} />
      <OrbitalRing radius={1.55} tilt={Math.PI / 2.6} speed={0.24} state={state} />
      <OrbitalRing radius={2.1} tilt={Math.PI / 3.5} speed={-0.17} state={state} />
      <OrbitalRing radius={2.65} tilt={Math.PI / 1.9} speed={0.11} state={state} />
    </>
  );
}

export function NeuralCore({ state, executionState }: { state: AiState; executionState: ExecutionState }) {
  return (
    <motion.div
      className={`neural-core ${state}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
    >
      <div className="core-vignette" />
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }} dpr={[1, 1.7]}>
        <NeuralScene state={state} />
      </Canvas>
      <div className="core-status">
        <span>{state}</span>
        <strong>{executionState}</strong>
      </div>
    </motion.div>
  );
}
