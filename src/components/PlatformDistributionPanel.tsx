import { z } from 'zod';
import { PlatformDistributionSchema, getPlatformColor } from '../types/trendData';

/**
 * Zod schema for PlatformDistribution props
 * All data comes from Tambo
 */
export const PlatformDistributionPanelPropsSchema = z.object({
  distribution: PlatformDistributionSchema.describe('Platform distribution data from Tambo'),
  title: z.string().default('Platform Distribution').describe('Panel title'),
});

export type PlatformDistributionPanelProps = z.infer<typeof PlatformDistributionPanelPropsSchema>;

/**
 * PlatformDistributionPanel Component
 * 
 * PURPOSE:
 * - Display discussion volume across platforms
 * - Show percentage breakdown via visual chart
 * - Prove Tambo controls platform data
 */
export function PlatformDistributionPanel({ distribution, title }: PlatformDistributionPanelProps) {
  const { platforms, totalVolume } = distribution;

  // Platform name mapping
  const platformNames: Record<string, string> = {
    youtube: 'YouTube',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    news: 'News Sites',
  };

  return (
    <div className="trend-panel platform-distribution-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <span className="panel-subtitle">
          {totalVolume.toLocaleString()} total discussions
        </span>
      </div>

      {/* Simple Pie Chart Visualization */}
      <div className="platform-chart">
        {/* Horizontal Stacked Bar (simpler than pie chart) */}
        <div className="distribution-bar">
          {platforms.map((platform) => (
            <div
              key={platform.platform}
              className="bar-segment"
              style={{
                width: `${platform.percentage}%`,
                backgroundColor: getPlatformColor(platform.platform),
              }}
              title={`${platformNames[platform.platform]}: ${platform.percentage}%`}
            />
          ))}
        </div>

        {/* Platform Legend */}
        <div className="platform-legend">
          {platforms.map((platform) => (
            <div key={platform.platform} className="legend-item">
              <div className="legend-row">
                <div className="legend-label">
                  <span 
                    className="legend-dot"
                    style={{ backgroundColor: getPlatformColor(platform.platform) }}
                  />
                  <span className="legend-name">
                    {platformNames[platform.platform]}
                  </span>
                </div>
                <span className="legend-percentage">
                  {platform.percentage}%
                </span>
              </div>
              <div className="legend-count">
                {platform.count.toLocaleString()} discussions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Timestamp */}
      <div className="panel-footer">
        <span className="update-time">
          Last updated: {new Date(distribution.updatedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}