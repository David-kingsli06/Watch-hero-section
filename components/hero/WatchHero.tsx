'use client';

import React, { useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { WatchScene } from './WatchScene';
import { HeroOverlay } from './HeroOverlay';

export function WatchHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 0 -> 1 smoothed scroll progress across 300vh
  const progress = useScrollProgress(containerRef, {
    damping: 0.08,
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#07090e]"
      aria-label="Aether Series 04 Smartwatch Product Showcase"
    >
      {/* Accessible Screen Reader Heading */}
      <h1 className="sr-only">
        Aether Series 04 Smartwatch — Titanium Grade 5 Architecture with 360-degree interactive reveal
      </h1>

      {/* Pinned 100vh Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,41,59,0.5),rgba(7,9,14,1))]">
        {/* Subtle background radial glow highlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + Math.sin(progress * Math.PI * 2) * 15}% 45%, rgba(56, 189, 248, 0.12), transparent 60%)`,
          }}
        />

        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <WatchScene progress={progress} />
        </div>

        {/* Text & Telemetry Overlay Layer */}
        <HeroOverlay progress={progress} />
      </div>
    </section>
  );
}
