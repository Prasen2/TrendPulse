import { useState, useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';
import { Globe } from './Globe';
import { HotspotSchema } from '../types/hotspot';

/**
 * Zod schema for GlobeContainer props
 */
export const GlobeContainerPropsSchema = z.object({
  radius: z.number().min(50).max(500).describe('Sphere radius in pixels'),
  color: z.string().describe('Globe color (hex format, e.g. #4a9eff)'),
  opacity: z.number().min(0).max(1).describe('Globe opacity'),
  wireframe: z.boolean().describe('Render as wireframe or solid'),
  autoRotationSpeed: z.number().min(0).max(0.01).describe('Auto-rotation speed'),
  enableInteraction: z.boolean().describe('Allow user interaction'),
  resumeDelayMs: z.number().min(0).max(10000).describe('Delay before resuming auto-rotation'),
  hotspots: z.array(HotspotSchema).describe('Trend hotspots to display'),
  hoveredCategory: z.string().optional().describe('Currently hovered category'),
});

export type GlobeContainerProps = z.infer<typeof GlobeContainerPropsSchema>;


export function GlobeContainer({
  radius,
  color,
  opacity,
  wireframe,
  autoRotationSpeed,
  enableInteraction,
  resumeDelayMs,
  hotspots,
  hoveredCategory,
}: GlobeContainerProps) {
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const handleInteractionStart = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setRotationEnabled(false);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setRotationEnabled(true);
      resumeTimerRef.current = null;
    }, resumeDelayMs);
  }, [resumeDelayMs]);

  return (
    <Globe
      radius={radius}
      color={color}
      opacity={opacity}
      wireframe={wireframe}
      rotationSpeed={autoRotationSpeed}
      rotationEnabled={rotationEnabled}
      interactionEnabled={enableInteraction}
      resumeDelayMs={resumeDelayMs}
      hotspots={hotspots}
      onInteractionStart={handleInteractionStart}
      onInteractionEnd={handleInteractionEnd}
      hoveredCategory={hoveredCategory}
    />
  );
}