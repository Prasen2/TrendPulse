import { Hotspot, HotspotCategory } from '../types/hotspot';

/**
 * Fake Hotspot Data Generator
 * 
 * PURPOSE:
 * - Generate fake trend data for demonstration
 * - Prove that updating data updates visuals
 * - NO real APIs involved
 */

export const INITIAL_FAKE_HOTSPOTS: Hotspot[] = [
  // North America - Tech trends
  {
    id: 'sf-tech',
    lat: 37.7749,
    lng: -122.4194,
    intensity: 0.9,
    category: 'tech' as HotspotCategory,
  },
  {
    id: 'nyc-finance',
    lat: 40.7128,
    lng: -74.0060,
    intensity: 0.75,
    category: 'finance' as HotspotCategory,
  },
  
  // Europe - News and health
  {
    id: 'london-news',
    lat: 51.5074,
    lng: -0.1278,
    intensity: 0.85,
    category: 'news' as HotspotCategory,
  },
  {
    id: 'berlin-health',
    lat: 52.5200,
    lng: 13.4050,
    intensity: 0.6,
    category: 'health' as HotspotCategory,
  },
  
  // Asia - Tech and entertainment
  {
    id: 'tokyo-entertainment',
    lat: 35.6762,
    lng: 139.6503,
    intensity: 0.8,
    category: 'entertainment' as HotspotCategory,
  },
  {
    id: 'singapore-tech',
    lat: 1.3521,
    lng: 103.8198,
    intensity: 0.7,
    category: 'tech' as HotspotCategory,
  },
  {
    id: 'mumbai-entertainment',
    lat: 19.0760,
    lng: 72.8777,
    intensity: 0.65,
    category: 'entertainment' as HotspotCategory,
  },
  
  // South America
  {
    id: 'sao-paulo-news',
    lat: -23.5505,
    lng: -46.6333,
    intensity: 0.55,
    category: 'news' as HotspotCategory,
  },
  
  // Africa
  {
    id: 'lagos-tech',
    lat: 6.5244,
    lng: 3.3792,
    intensity: 0.5,
    category: 'tech' as HotspotCategory,
  },
  
  // Australia
  {
    id: 'sydney-health',
    lat: -33.8688,
    lng: 151.2093,
    intensity: 0.7,
    category: 'health' as HotspotCategory,
  },
];

/**
 * Generate random hotspot intensity variation
 * Used to simulate reactive data updates
 */
export function varyIntensity(currentIntensity: number, maxVariation: number = 0.2): number {
  const variation = (Math.random() - 0.5) * 2 * maxVariation;
  const newIntensity = currentIntensity + variation;
  
  // Clamp to valid range [0, 1]
  return Math.max(0.3, Math.min(1, newIntensity));
}

/**
 * Update fake hotspots with random intensity variations
 * This simulates live trend data updates
 */
export function updateFakeHotspots(currentHotspots: Hotspot[]): Hotspot[] {
  return currentHotspots.map(hotspot => ({
    ...hotspot,
    intensity: varyIntensity(hotspot.intensity, 0.15),
  }));
}

/**
 * Add a new random hotspot
 * Demonstrates adding new data points
 */
export function addRandomHotspot(currentHotspots: Hotspot[]): Hotspot[] {
  const categories: HotspotCategory[] = ['tech', 'health', 'finance', 'news', 'entertainment'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const newHotspot: Hotspot = {
    id: `hotspot-${Date.now()}`,
    lat: (Math.random() - 0.5) * 160, // -80 to 80
    lng: (Math.random() - 0.5) * 360, // -180 to 180
    intensity: 0.4 + Math.random() * 0.4, // 0.4 to 0.8
    category: randomCategory,
  };
  
  return [...currentHotspots, newHotspot];
}

/**
 * Remove a random hotspot
 * Demonstrates removing data points
 */
export function removeRandomHotspot(currentHotspots: Hotspot[]): Hotspot[] {
  if (currentHotspots.length <= 3) return currentHotspots; // Keep minimum 3
  
  const randomIndex = Math.floor(Math.random() * currentHotspots.length);
  return currentHotspots.filter((_, index) => index !== randomIndex);
}