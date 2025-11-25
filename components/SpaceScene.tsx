
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import MoldingSphere from './MoldingSphere';
import { SphereConfig } from '../types';
import * as THREE from 'three';

interface SpaceSceneProps {
  config: SphereConfig;
  resetTrigger: number;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({ config, resetTrigger }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance"
      }}
    >
      <color attach="background" args={['#020208']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 10, 10]} intensity={1.5} color="#4f46e5" />
      <pointLight position={[-15, -10, -10]} intensity={1.5} color="#ec4899" />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#ffffff" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0.5} fade speed={1} />
      <Sparkles count={300} scale={12} size={3} speed={0.3} opacity={0.4} color="#a5f3fc" />
      
      <fog attach="fog" args={['#020208', 6, 30]} />

      <Suspense fallback={null}>
        {/* Key forces remount when particle count changes, effectively resizing buffers */}
        <MoldingSphere 
          key={config.particleCount} 
          config={config} 
          resetTrigger={resetTrigger} 
        />
      </Suspense>

      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        // Configured for Right Click orbit to leave Left Click free for molding
        mouseButtons={{
          LEFT: undefined, 
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE
        }}
        autoRotate={false} 
      />
    </Canvas>
  );
};

export default SpaceScene;
