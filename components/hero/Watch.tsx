'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface WatchProps {
  progress: number;
  reducedMotion?: boolean;
}

/**
 * Procedural fallback watch component constructed using Three.js primitives
 * when /models/smartwatch.glb is not present.
 * Featuring:
 * - Brushed titanium / dark steel rounded case
 * - Beveled sapphire crystal with refractive physical properties
 * - Matte textured silicone strap with lug connectors
 * - Digital crown button with subtle metallic sheen
 */
function ProceduralWatch() {
  const caseMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1f242d'),
        metalness: 0.88,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        reflectivity: 0.9,
      }),
    []
  );

  const bezelMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#101317'),
        metalness: 0.95,
        roughness: 0.18,
        clearcoat: 0.8,
        clearcoatRoughness: 0.08,
      }),
    []
  );

  const screenGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0a0d12'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.25,
        ior: 1.52, // Typical sapphire crystal index of refraction
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      }),
    []
  );

  const displayFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#030508'),
        roughness: 0.6,
        metalness: 0.1,
      }),
    []
  );

  const strapMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#181b20'),
        roughness: 0.82, // Subtle tactile silicone roughness
        metalness: 0.05,
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#38bdf8'), // Subtle cyan status indicator glow
        emissive: new THREE.Color('#0284c7'),
        emissiveIntensity: 0.45,
        roughness: 0.3,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Main Watch Case Chassis */}
      <mesh material={caseMaterial} castShadow receiveShadow>
        <boxGeometry args={[2.0, 2.3, 0.44]} />
      </mesh>

      {/* Screen Bezel Ring */}
      <mesh position={[0, 0, 0.22]} material={bezelMaterial}>
        <boxGeometry args={[1.82, 2.12, 0.03]} />
      </mesh>

      {/* Internal Display Surface */}
      <mesh position={[0, 0, 0.23]} material={displayFaceMaterial}>
        <boxGeometry args={[1.74, 2.04, 0.02]} />
      </mesh>

      {/* Minimalist UI Ring on Screen */}
      <mesh position={[0, 0.05, 0.245]} material={accentMaterial}>
        <ringGeometry args={[0.55, 0.58, 48]} />
      </mesh>

      {/* Sapphire Crystal Glass Cover */}
      <mesh position={[0, 0, 0.25]} material={screenGlassMaterial}>
        <boxGeometry args={[1.76, 2.06, 0.02]} />
      </mesh>

      {/* Digital Crown on Right Side */}
      <mesh position={[1.08, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} material={bezelMaterial}>
        <cylinderGeometry args={[0.2, 0.2, 0.18, 32]} />
      </mesh>

      {/* Secondary Side Button */}
      <mesh position={[1.04, -0.4, 0]} material={caseMaterial}>
        <boxGeometry args={[0.08, 0.38, 0.16]} />
      </mesh>

      {/* Sensor Pod on Back */}
      <mesh position={[0, 0, -0.24]} material={bezelMaterial}>
        <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
      </mesh>

      {/* Top Silicone Strap (curving downward) */}
      <mesh position={[0, 1.8, -0.2]} rotation={[-0.22, 0, 0]} material={strapMaterial} castShadow>
        <boxGeometry args={[1.4, 1.5, 0.16]} />
      </mesh>

      {/* Bottom Silicone Strap */}
      <mesh position={[0, -1.8, -0.2]} rotation={[0.22, 0, 0]} material={strapMaterial} castShadow>
        <boxGeometry args={[1.4, 1.5, 0.16]} />
      </mesh>
    </group>
  );
}

/**
 * GLTF Loader wrapper that safely attempts to fetch /models/smartwatch.glb
 * and falls back to procedural geometry if the asset is missing or fails.
 */
function ModelOrProcedural() {
  const [hasModel, setHasModel] = React.useState<boolean | null>(null);

  useEffect(() => {
    // Check if the GLB file exists at the public path
    fetch('/models/smartwatch.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasModel(true);
        else setHasModel(false);
      })
      .catch(() => setHasModel(false));
  }, []);

  if (hasModel === true) {
    return <GLTFModel path="/models/smartwatch.glb" />;
  }

  // Fallback procedural watch (ensures zero broken states)
  return <ProceduralWatch />;
}

function GLTFModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.8} />;
}

export function Watch({ progress, reducedMotion = false }: WatchProps) {
  const groupRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    if (reducedMotion) {
      // Accessible default: stationary presentation angle
      groupRef.current.rotation.y = 0.45;
      groupRef.current.rotation.x = 0.15;
      return;
    }

    // Full 360-degree rotation mapped from normalized scroll progress (0 -> 2π)
    const targetY = progress * Math.PI * 2;
    // Add subtle resting pitch so the bevels and light catch the camera dynamically
    const targetX = 0.12 + Math.sin(progress * Math.PI * 2) * 0.08;

    groupRef.current.rotation.y = targetY;
    groupRef.current.rotation.x = targetX;

    // Soft Light Sweep calculation:
    // Move key light along an orbital arc so a streak glides across titanium case and sapphire crystal
    if (keyLightRef.current) {
      const angle = progress * Math.PI * 2 + Math.PI / 4;
      const radius = 6.0;
      keyLightRef.current.position.x = Math.cos(angle) * radius;
      keyLightRef.current.position.z = Math.sin(angle) * radius + 2.5;
      keyLightRef.current.position.y = 3.5 + Math.cos(progress * Math.PI) * 1.5;
    }
  });

  return (
    <>
      {/* Dynamic Key Light providing continuous edge highlight sweep */}
      <spotLight
        ref={keyLightRef}
        position={[4, 5, 4]}
        intensity={reducedMotion ? 2.5 : 3.8}
        angle={0.65}
        penumbra={0.9}
        color="#f8fafc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      <group ref={groupRef}>
        <ModelOrProcedural />
      </group>
    </>
  );
}

// Pre-preload GLTF if available
useGLTF.preload?.('/models/smartwatch.glb');
