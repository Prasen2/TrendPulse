import { z } from 'zod';

/**
 * Video Angle Schema
 */
export const VideoAngleSchema = z.object({
  title: z.string().describe('Suggested video title'),
  angle: z.string().describe('Content angle or hook'),
  estimatedViews: z.string().nullable().describe('Estimated view potential (e.g. "10K-50K")'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Production difficulty'),
});

export type VideoAngle = z.infer<typeof VideoAngleSchema>;