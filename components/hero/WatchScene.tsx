'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Watch } from './Watch';

interface WatchSceneProps {
  progress: number;
}

export function WatchScene({ progress }: WatchSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  useEffect(() => {
    // Check OS-level accessibility setting for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Hardware heuristic: detect mobile/low core count to cap DPR and shadow footprint
    if (
      (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      /Mobi|Android|iPhone/i.test(navigator.userAgent)
    ) {
      setIsLowPowerDevice(true);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div className="relative w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 38 }}
        dpr={isLowPowerDevice ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        shadows={!isLowPowerDevice}
        className="w-full h-full"
      >
        {/* Fill Ambient light for base illumination */}
        <ambientLight intensity={0.55} color="#cbd5e1" />

        {/* Studio Environment Map for realistic metallic specular reflections */}
        <Environment preset="studio" environmentIntensity={0.85} />

        {/* Rim Light (cool blueish tint for crisp edge definition) */}
        <directionalLight position={[-4, -2, -3]} intensity={1.8} color="#94a3b8" />

        {/* Top Soft Downlight */}
        <directionalLight position={[0, 6, 2]} intensity={0.7} color="#ffffff" />

        <Suspense fallback={null}>
          <Watch progress={progress} reducedMotion={reducedMotion} />

          {/* Soft Ground Contact Shadow (anchoring the watch in 3D space) */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.65}
            scale={7}
            blur={2.4}
            far={4.5}
            resolution={isLowPowerDevice ? 256 : 512}
            color="#020617"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
