import { z } from 'zod';

/**
 * Hotspot Category Type
 * Represents different types of trending topics
 */
export const HotspotCategorySchema = z.enum([
  'tech',
  'health',
  'finance',
  'news',
  'entertainment'
]).describe('Category of the trending topic');

export type HotspotCategory = z.infer<typeof HotspotCategorySchema>;

/**
 * Hotspot Data Model
 * Represents a single trend hotspot on the globe
 */
export const HotspotSchema = z.object({
  id: z.string().describe('Unique identifier for the hotspot'),
  lat: z.number().min(-90).max(90).describe('Latitude coordinate (-90 to 90)'),
  lng: z.number().min(-180).max(180).describe('Longitude coordinate (-180 to 180)'),
  intensity: z.number().min(0).max(1).describe('Trend intensity (0 = weak, 1 = strongest)'),
  category: HotspotCategorySchema.describe('Category of the trending topic'),
});

export type Hotspot = z.infer<typeof HotspotSchema>;

/**
 * Category Color Mapping
 */
export const CATEGORY_COLORS: Record<HotspotCategory, string> = {
  tech: '#00d9ff',        // Cyan
  health: '#00ff88',      // Green
  finance: '#b366ff',     // Purple
  news: '#ffb347',        // Amber
  entertainment: '#ff66cc' // Pink
};

export function getCategoryColor(category: HotspotCategory): string {
  return CATEGORY_COLORS[category];
}

/**
 * Helper: Convert lat/lng to 3D position on sphere
 * 
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @param radius Sphere radius
 * @returns {x, y, z} 3D coordinates
 */
export function latLngToVector3(lat: number, lng: number, radius: number): { x: number; y: number; z: number } {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  // Spherical to Cartesian conversion
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}