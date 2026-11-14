'use client';

import React, { useId } from 'react';

interface HeroOverlayProps {
  progress: number;
}

interface StageConfig {
  tag: string;
  title: string;
  description: string;
  badge: string;
  range: [number, number];
}

const STAGES: StageConfig[] = [
  {
    range: [0, 0.33],
    badge: 'Crafted Precision',
    tag: 'Titanium Grade 5',
    title: 'Precision in every curve.',
    description: 'Sculpted from aerospace-grade titanium with an ultra-fine matte ceramic blast.',
  },
  {
    range: [0.33, 0.66],
    badge: 'Retina Display',
    tag: 'Edge-to-Edge Sapphire',
    title: 'Always on. Always lucid.',
    description: '3,000 nits peak outdoor brightness beneath scratch-resistant sapphire crystal.',
  },
  {
    range: [0.66, 1.0],
    badge: 'Endurance Architecture',
    tag: '100m Water Resistance',
    title: 'Engineered to outlast.',
    description: 'Dual-frequency GPS, biometric sensors, and 72-hour sustained battery endurance.',
  },
];

/**
 * Calculates smooth enter/exit opacity and vertical translate transforms
 * for each text stage based on continuous scroll progress.
 * Adheres to Emil Design Engineering:
 * - Enter: slides up slightly into place with fast fade-in
 * - Exit: slides slightly up and dissolves smoothly without abrupt cutoffs
 */
function getStageMotion(progress: number, start: number, end: number) {
  // Pad the transition window slightly for smooth handoff
  const fadeDuration = 0.08;
  const inStart = start;
  const inEnd = start + fadeDuration;
  const outStart = end - fadeDuration;
  const outEnd = end;

  let opacity = 0;
  let translateY = 18; // px

  if (progress < inStart || progress > outEnd) {
    opacity = 0;
    translateY = progress < inStart ? 18 : -18;
  } else if (progress >= inStart && progress <= inEnd) {
    const t = (progress - inStart) / (inEnd - inStart);
    // Smoothstep ease curve
    const ease = t * t * (3 - 2 * t);
    opacity = ease;
    translateY = 18 * (1 - ease);
  } else if (progress > inEnd && progress < outStart) {
    opacity = 1;
    translateY = 0;
  } else if (progress >= outStart && progress <= outEnd) {
    const t = (progress - outStart) / (outEnd - outStart);
    const ease = t * t * (3 - 2 * t);
    opacity = 1 - ease;
    translateY = -18 * ease;
  }

  return { opacity, translateY };
}

export function HeroOverlay({ progress }: HeroOverlayProps) {
  const headingId = useId();

  // Scroll cue fades out completely in the first 10% of scroll
  const cueOpacity = Math.max(0, 1 - progress * 10);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-16 pointer-events-none select-none">
      {/* Top Bar: Brand, Category, Status */}
      <header className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-300">
            AETHER HOROLOGY / SERIES 04
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
            Interactive Reveal
          </span>
        </div>
      </header>

      {/* Main Content Stage Area: Left-aligned typography */}
      <div className="relative w-full max-w-2xl min-h-[220px] flex items-center">
        {STAGES.map((stage, idx) => {
          const { opacity, translateY } = getStageMotion(
            progress,
            stage.range[0],
            stage.range[1]
          );

          // Avoid rendering or screen-reader noise for completely invisible stages
          const isVisible = opacity > 0.01;

          return (
            <article
              key={idx}
              aria-hidden={!isVisible}
              className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-75 will-change-transform"
              style={{
                opacity,
                transform: `translateY(calc(-50% + ${translateY}px))`,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {stage.badge}
                </span>
                <span className="text-xs font-mono text-slate-400 tracking-wider">
                  [{stage.tag}]
                </span>
              </div>

              <h2
                id={idx === 0 ? headingId : undefined}
                className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.08] mb-4"
              >
                {stage.title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-lg font-normal leading-relaxed">
                {stage.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* Bottom Row: Rotation telemetry & initial scroll cue */}
      <footer className="w-full flex items-end justify-between">
        {/* Realtime Degree Telemetry */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Azimuth Angle
          </span>
          <span className="text-lg sm:text-xl font-mono text-white/90">
            {Math.round(progress * 360)}°
          </span>
        </div>

        {/* Scroll Cue (Fades out seamlessly as user scrolls) */}
        <div
          className="flex flex-col items-center gap-2 transition-opacity duration-200"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            Scroll to Explore
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <span className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
          </div>
        </div>

        {/* Right Metric Pill */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Chassis Grade
          </span>
          <span className="text-sm font-mono text-slate-300">Ti-6Al-4V</span>
        </div>
      </footer>
    </div>
  );
}
