'use client';

import { useEffect, useState } from 'react';

export interface ScrollProgressOptions {
  /**
   * Linear interpolation damping factor (0 < lerp <= 1).
   * Lower values produce smoother, more damped motion.
   * Default: 0.08
   */
  damping?: number;
  /**
   * If true, damping is bypassed and target progress is applied immediately.
   */
  disableDamping?: boolean;
}

/**
 * Custom hook tracking scroll progress of a container element relative to viewport.
 * Returns smoothed (lerped) scroll progress clamped between 0 and 1.
 */
export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) {
  const { damping = 0.08, disableDamping = false } = options;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const calculateProgress = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;

      if (totalScrollableDistance <= 0) {
        targetProgress = 0;
        return;
      }

      // rect.top is 0 when container starts, -totalScrollableDistance when container scroll finishes
      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollableDistance;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      if (disableDamping) {
        currentProgress = targetProgress;
        setProgress(currentProgress);
      }
    };

    // RAF loop for smooth lerp interpolation (Emil design engineering principle)
    const updateLoop = () => {
      if (!disableDamping) {
        // Linear interpolation: current + (target - current) * factor
        const delta = targetProgress - currentProgress;
        if (Math.abs(delta) > 0.0001) {
          currentProgress += delta * damping;
          setProgress(currentProgress);
        } else if (currentProgress !== targetProgress) {
          currentProgress = targetProgress;
          setProgress(currentProgress);
        }
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Calculate immediately and bind listeners
    calculateProgress();
    animationFrameId = requestAnimationFrame(updateLoop);

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef, damping, disableDamping]);

  return progress;
}
