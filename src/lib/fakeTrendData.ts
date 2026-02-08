import { 
  TrendingTopic, 
  PlatformDistribution, 
  TrendVelocity,
  VelocityDataPoint 
} from '../types/trendData';
import { HotspotCategory } from '../types/hotspot';

/**
 * FAKE TREND DATA GENERATOR
 * 
 * PURPOSE:
 * - Generate fake trend data for demonstration
 * - Prove Tambo orchestration works
 * - NO real APIs involved

 */



export const INITIAL_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'topic-1',
    name: 'AI Regulation Framework',
    category: 'tech' as HotspotCategory,
    score: 95,
    velocity: 'rising',
  },
  {
    id: 'topic-2',
    name: 'Global Climate Summit',
    category: 'news' as HotspotCategory,
    score: 87,
    velocity: 'rising',
  },
  {
    id: 'topic-3',
    name: 'Mental Health Awareness',
    category: 'health' as HotspotCategory,
    score: 76,
    velocity: 'stable',
  },
  {
    id: 'topic-4',
    name: 'Cryptocurrency Market Shift',
    category: 'finance' as HotspotCategory,
    score: 68,
    velocity: 'falling',
  },
  {
    id: 'topic-5',
    name: 'Streaming Platform Wars',
    category: 'entertainment' as HotspotCategory,
    score: 54,
    velocity: 'stable',
  },
];

/**
 * Update trending topics with random score variations
 * Simulates live data updates
 */
export function updateTrendingTopics(currentTopics: TrendingTopic[]): TrendingTopic[] {
  return currentTopics.map(topic => {
    // Vary score by ±10 points
    const scoreChange = (Math.random() - 0.5) * 20;
    const newScore = Math.max(10, Math.min(100, topic.score + scoreChange));

    // Update velocity based on change
    let velocity: 'rising' | 'stable' | 'falling' = 'stable';
    if (scoreChange > 5) velocity = 'rising';
    else if (scoreChange < -5) velocity = 'falling';

    return {
      ...topic,
      score: Math.round(newScore),
      velocity,
    };
  });
}

// ============================================
// PLATFORM DISTRIBUTION
// ============================================

/**
 * Initial platform distribution
 */
export const INITIAL_PLATFORM_DISTRIBUTION: PlatformDistribution = {
  platforms: [
    { platform: 'youtube', percentage: 35, count: 45200 },
    { platform: 'x', percentage: 28, count: 36100 },
    { platform: 'reddit', percentage: 22, count: 28400 },
    { platform: 'news', percentage: 15, count: 19300 },
  ],
  totalVolume: 129000,
  updatedAt: new Date().toISOString(),
};

/**
 * Update platform distribution with variations
 * Simulates shifting discussion patterns
 */
export function updatePlatformDistribution(current: PlatformDistribution): PlatformDistribution {
  // Calculate new random percentages that sum to 100
  const randomValues = current.platforms.map(() => Math.random());
  const sum = randomValues.reduce((a, b) => a + b, 0);
  const normalizedValues = randomValues.map(v => v / sum);

  // Apply variations (±5%)
  const newPlatforms = current.platforms.map((platform, index) => {
    const variation = (Math.random() - 0.5) * 10;
    const newPercentage = Math.max(5, Math.min(50, normalizedValues[index] * 100 + variation));
    
    return {
      ...platform,
      percentage: Math.round(newPercentage),
      count: Math.round((newPercentage / 100) * current.totalVolume),
    };
  });

  // Normalize to ensure sum is exactly 100%
  const totalPercentage = newPlatforms.reduce((sum, p) => sum + p.percentage, 0);
  const adjustment = 100 - totalPercentage;
  if (adjustment !== 0) {
    newPlatforms[0].percentage += adjustment;
    newPlatforms[0].count = Math.round((newPlatforms[0].percentage / 100) * current.totalVolume);
  }

  return {
    ...current,
    platforms: newPlatforms,
    updatedAt: new Date().toISOString(),
  };
}

// ============================================
// TREND VELOCITY
// ============================================

/**
 * Generate initial velocity history (last 10 data points)
 */
function generateVelocityHistory(): VelocityDataPoint[] {
  const history: VelocityDataPoint[] = [];
  const now = Date.now();

  for (let i = 9; i >= 0; i--) {
    const timestamp = new Date(now - i * 60000); // 1 minute intervals
    const value = Math.sin(i / 3) * 30 + (Math.random() - 0.5) * 10;
    
    history.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value),
    });
  }

  return history;
}

/**
 * Initial velocity data
 */
export const INITIAL_TREND_VELOCITY: TrendVelocity = {
  current: 35,
  direction: 'rising',
  history: generateVelocityHistory(),
  changePercent: 12.5,
};

/**
 * Update velocity with new data point
 * Simulates continuous velocity tracking
 */
export function updateTrendVelocity(current: TrendVelocity): TrendVelocity {
  // Calculate new velocity value
  const lastValue = current.history[current.history.length - 1]?.value || 0;
  const change = (Math.random() - 0.5) * 20;
  const newValue = Math.max(-100, Math.min(100, lastValue + change));

  // Determine direction
  let direction: 'rising' | 'stable' | 'falling' = 'stable';
  if (newValue > 20) direction = 'rising';
  else if (newValue < -20) direction = 'falling';

  // Calculate change percentage
  const changePercent = lastValue !== 0 ? ((newValue - lastValue) / Math.abs(lastValue)) * 100 : 0;

  // Add new data point to history
  const newHistory = [
    ...current.history.slice(1), // Remove oldest
    {
      timestamp: new Date().toISOString(),
      value: Math.round(newValue),
    },
  ];

  return {
    current: Math.round(newValue),
    direction,
    history: newHistory,
    changePercent: Math.round(changePercent * 10) / 10,
  };
}


export interface TrendData {
  topics: TrendingTopic[];
  distribution: PlatformDistribution;
  velocity: TrendVelocity;
}

export function updateAllTrendData(current: TrendData): TrendData {
  return {
    topics: updateTrendingTopics(current.topics),
    distribution: updatePlatformDistribution(current.distribution),
    velocity: updateTrendVelocity(current.velocity),
  };
}

/**
 * Get initial trend data
 */
export function getInitialTrendData(): TrendData {
  return {
    topics: INITIAL_TRENDING_TOPICS,
    distribution: INITIAL_PLATFORM_DISTRIBUTION,
    velocity: INITIAL_TREND_VELOCITY,
  };
}