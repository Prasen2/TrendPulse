import { z } from 'zod';
import { HotspotCategorySchema } from './hotspot';

/**
 * TREND DATA SCHEMAS
 */
export const TrendingTopicSchema = z.object({
  id: z.string().describe('Unique identifier'),
  name: z.string().describe('Topic name (e.g., "AI Regulation", "Climate Summit")'),
  category: HotspotCategorySchema.describe('Category classification'),
  score: z.number().min(0).max(100).describe('Trending score (0-100)'),
  velocity: z.enum(['rising', 'stable', 'falling']).describe('Trend direction'),
});

export type TrendingTopic = z.infer<typeof TrendingTopicSchema>;

// ============================================
// PLATFORM DISTRIBUTION
// ============================================

/**
 * Single Platform Data Point
 * Used by the Platform Distribution panel
 */
export const PlatformDataSchema = z.object({
  platform: z.enum(['youtube', 'x', 'reddit', 'news']).describe('Platform identifier'),
  percentage: z.number().min(0).max(100).describe('Percentage of total discussion volume'),
  count: z.number().min(0).describe('Absolute discussion count'),
});

export type PlatformData = z.infer<typeof PlatformDataSchema>;

/**
 * Complete Platform Distribution
 * Aggregates all platforms (must sum to 100%)
 */
export const PlatformDistributionSchema = z.object({
  platforms: z.array(PlatformDataSchema).describe('Distribution across platforms'),
  totalVolume: z.number().min(0).describe('Total discussion volume across all platforms'),
  updatedAt: z.string().describe('Last update timestamp'),
});

export type PlatformDistribution = z.infer<typeof PlatformDistributionSchema>;

// ============================================
// TREND VELOCITY
// ============================================

/**
 * Velocity Data Point (time series)
 */
export const VelocityDataPointSchema = z.object({
  timestamp: z.string().describe('ISO timestamp'),
  value: z.number().describe('Velocity value (-100 to +100, negative = falling, positive = rising)'),
});

export type VelocityDataPoint = z.infer<typeof VelocityDataPointSchema>;

/**
 * Trend Velocity Panel Data
 * Shows overall trend acceleration/deceleration
 */
export const TrendVelocitySchema = z.object({
  current: z.number().min(-100).max(100).describe('Current velocity (-100 = sharp decline, 0 = stable, +100 = sharp rise)'),
  direction: z.enum(['rising', 'stable', 'falling']).describe('Overall direction'),
  history: z.array(VelocityDataPointSchema).describe('Historical velocity data for graph'),
  changePercent: z.number().describe('Percent change from previous period'),
});

export type TrendVelocity = z.infer<typeof TrendVelocitySchema>;

// ============================================
// PLATFORM COLORS
// ============================================

/**
 * Platform Color Mapping
 * Consistent visual identity across charts
 */
export const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#FF0000',  // YouTube Red
  x: '#1DA1F2',        // X (Twitter) Blue
  reddit: '#FF4500',   // Reddit Orange
  news: '#6B46C1',     // News Purple
};

/**
 * Helper: Get color for platform
 */
export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] || '#888888';
}

// ============================================
// VELOCITY DIRECTION COLORS
// ============================================

export const VELOCITY_COLORS = {
  rising: '#00ff88',   // Green
  stable: '#4a9eff',   // Blue
  falling: '#ff6b6b',  // Red
};

/**
 * Helper: Get color for velocity direction
 */
export function getVelocityColor(direction: 'rising' | 'stable' | 'falling'): string {
  return VELOCITY_COLORS[direction];
}