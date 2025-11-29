import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SphereConfig } from '../types';

interface MoldingSphereProps {
  config: SphereConfig;
  resetTrigger: number;
}

const MoldingSphere: React.FC<MoldingSphereProps> = ({ config, resetTrigger }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, raycaster, pointer } = useThree();
  const [isLeftMouseDown, setIsLeftMouseDown] = useState(false);

  // Generate sharp particle texture (Crisp circle)
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(32, 32, 28, 0, 2 * Math.PI);
      context.fillStyle = '#ffffff';
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Initialize Data
  const { originalPositions, physicsPositions, velocities, colors } = useMemo(() => {
    const count = config.particleCount;
    const orig = new Float32Array(count * 3);
    const phys = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const r = 3.5; // Base radius

    for (let i = 0; i < count; i++) {
      // Fibonacci Sphere Distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      phys[i * 3] = x;
      phys[i * 3 + 1] = y;
      phys[i * 3 + 2] = z;

      vels[i * 3] = 0;
      vels[i * 3 + 1] = 0;
      vels[i * 3 + 2] = 0;

      cols[i * 3] = 1;
      cols[i * 3 + 1] = 1;
      cols[i * 3 + 2] = 1;
    }

    return {
      originalPositions: orig,
      physicsPositions: phys,
      velocities: vels,
      colors: cols
    };
  }, [config.particleCount]);

  // Handle Reset
  useEffect(() => {
    for (let i = 0; i < originalPositions.length; i++) {
      physicsPositions[i] = originalPositions[i];
      velocities[i] = 0;
    }
    // Force one update to render immediately
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [resetTrigger, originalPositions, physicsPositions, velocities]);

  // Handle Color/Effect Updates
  useEffect(() => {
    if (!pointsRef.current) return;
    const count = config.particleCount;
    const colorAttribute = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;

    const colorA = new THREE.Color(config.colorA);
    const colorB = new THREE.Color(config.colorB);
    const tempColor = new THREE.Color();
    const r = 3.5;

    // Pre-define effect palettes
    const fireColors = [new THREE.Color('#ff3300'), new THREE.Color('#ffaa00'), new THREE.Color('#ff0000')];
    const waterColors = [new THREE.Color('#00ffff'), new THREE.Color('#0055ff'), new THREE.Color('#e0ffff')];
    const toxicColors = [new THREE.Color('#77ff00'), new THREE.Color('#ccff00'), new THREE.Color('#00ff00')];
    const lightningColors = [new THREE.Color('#e0e0ff'), new THREE.Color('#a000ff'), new THREE.Color('#ffffff')];

    for (let i = 0; i < count; i++) {
      const ix = i * 3;

      if (config.effect !== 'none') {
        let palette;
        if (config.effect === 'fire') palette = fireColors;
        else if (config.effect === 'water') palette = waterColors;
        else if (config.effect === 'toxic') palette = toxicColors;
        else palette = lightningColors;

        // Randomize color from palette for effects
        const rand = Math.random();
        if (rand < 0.33) tempColor.copy(palette[0]);
        else if (rand < 0.66) tempColor.copy(palette[1]);
        else tempColor.copy(palette[2]);

      } else {
        // Standard Gradient
        const y = originalPositions[ix + 1];
        const t = (y + r) / (2 * r);
        tempColor.lerpColors(colorA, colorB, THREE.MathUtils.clamp(t, 0, 1));
      }

      // Update the 'state' colors array so we can read it in useFrame
      colors[ix] = tempColor.r;
      colors[ix + 1] = tempColor.g;
      colors[ix + 2] = tempColor.b;

      colorAttribute.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
    }

    colorAttribute.needsUpdate = true;
  }, [config.colorA, config.colorB, config.particleCount, config.effect, originalPositions, colors]);

  // Mouse Events
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsLeftMouseDown(true);
    };
    const handleMouseUp = () => setIsLeftMouseDown(false);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Physics & Animation Loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !meshRef.current || !groupRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    // 1. Raycasting
    let localHitPoint: THREE.Vector3 | null = null;

    if (isLeftMouseDown) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        localHitPoint = groupRef.current.worldToLocal(intersects[0].point.clone());
      }
    }

    const dt = Math.min(delta, 0.05);
    const time = state.clock.getElapsedTime();
    const count = config.particleCount;
    const moldRadiusSq = config.moldRadius * config.moldRadius;
    const isLiquid = config.mode === 'liquid';

    const drag = isLiquid
      ? 1.0 - (config.viscosity * 3.5)
      : 0.90;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      let px = physicsPositions[ix];
      let py = physicsPositions[iy];
      let pz = physicsPositions[iz];

      let vx = velocities[ix];
      let vy = velocities[iy];
      let vz = velocities[iz];

      const ox = originalPositions[ix];
      const oy = originalPositions[iy];
      const oz = originalPositions[iz];

      // --- A. Mouse Force (Repulsion) ---
      if (localHitPoint) {
        const dx = px - localHitPoint.x;
        const dy = py - localHitPoint.y;
        const dz = pz - localHitPoint.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < moldRadiusSq) {
          const dist = Math.sqrt(distSq);
          const forceFactor = (1 - dist / config.moldRadius);
          const forceMag = forceFactor * config.moldStrength * 80 * dt;

          let nx = dx / dist;
          let ny = dy / dist;
          let nz = dz / dist;

          if (dist < 0.0001) { nx = 0; ny = 1; nz = 0; }

          vx += nx * forceMag;
          vy += ny * forceMag;
          vz += nz * forceMag;
        }
      }

      // --- B. Spring Force (Liquid Only) ---
      if (isLiquid) {
        const springStrength = config.tension * 50 * dt;
        vx += (ox - px) * springStrength;
        vy += (oy - py) * springStrength;
        vz += (oz - pz) * springStrength;
      }

      // --- C. Integration & Damping ---
      vx *= drag;
      vy *= drag;
      vz *= drag;

      if (!isLiquid && Math.abs(vx) + Math.abs(vy) + Math.abs(vz) < 0.001) {
        vx = 0; vy = 0; vz = 0;
      }

      px += vx;
      py += vy;
      pz += vz;

      velocities[ix] = vx;
      velocities[iy] = vy;
      velocities[iz] = vz;

      physicsPositions[ix] = px;
      physicsPositions[iy] = py;
      physicsPositions[iz] = pz;

      // --- D. Visual Effects ---
      let rx = px;
      let ry = py;
      let rz = pz;

      const noiseAmp = 0.02;
      rx += Math.sin(time * 0.5 + py) * noiseAmp;
      ry += Math.cos(time * 0.3 + px) * noiseAmp;
      rz += Math.sin(time * 0.4 + pz) * noiseAmp;

      if (config.effect === 'fire') {
        const fireHeight = (py + 4) / 8;
        const turbulence = Math.sin(time * 5 + py * 2) * 0.1 * fireHeight;
        const rise = Math.sin(time * 3 + px * 5) * 0.05;
        rx += turbulence;
        ry += rise + 0.05 * fireHeight;
        if (py > 2) {
          rx += (Math.random() - 0.5) * 0.1;
          ry += (Math.random() - 0.5) * 0.1;
        }
      }
      else if (config.effect === 'water') {
        const wave = Math.sin(time * 2 + px * 2) * 0.1;
        const wave2 = Math.cos(time * 1.5 + pz * 2) * 0.1;
        ry += wave + wave2;
      }
      else if (config.effect === 'toxic') {
        const drip = Math.sin(time * 1 + px * 10) * Math.sin(time + py) * 0.15;
        ry -= Math.abs(drip);
      }
      else if (config.effect === 'lightning') {
        if (Math.random() > 0.95) {
          rx += (Math.random() - 0.5) * 0.3;
          ry += (Math.random() - 0.5) * 0.3;
          rz += (Math.random() - 0.5) * 0.3;
        }
      }

      positionAttribute.setXYZ(i, rx, ry, rz);
    }

    positionAttribute.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={physicsPositions.length / 3}
            array={new Float32Array(physicsPositions.length)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={particleTexture}
          size={config.particleSize}
          vertexColors
          transparent
          alphaTest={0.001}
          opacity={1.0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[3.4, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default MoldingSphere;
