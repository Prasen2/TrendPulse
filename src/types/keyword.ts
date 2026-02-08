import { z } from 'zod';

/**
 * Keyword Schema
 */
export const KeywordSchema = z.object({
  text: z.string().describe('Keyword text'),
  relevance: z.number().min(0).max(100).describe('Relevance score 0-100'),
});

export type Keyword = z.infer<typeof KeywordSchema>;