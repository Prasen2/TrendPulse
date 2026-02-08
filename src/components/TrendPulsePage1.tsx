import { useState } from 'react';
import { z } from 'zod';
import { IntroSection, IntroSectionPropsSchema } from './IntroSection';
import { FeatureHighlights, FeatureHighlightsPropsSchema } from './FeatureHighlights';
import { ResearchNowCTA } from './ResearchNowCTA';
import { GlobeContainer, GlobeContainerPropsSchema } from './GlobeContainer';
import { TrendingTopicsList, TrendingTopicsListPropsSchema } from './TrendingTopicsList';
import { PlatformDistributionPanel, PlatformDistributionPanelPropsSchema } from './PlatformDistributionPanel';
import { TrendVelocityPanel, TrendVelocityPanelPropsSchema } from './TrendVelocityPanel';
import { HotspotCategory } from '../types/hotspot';

/**
 * Category configuration with colors matching the visualization
 */
const CATEGORIES: Array<{
  id: HotspotCategory;
  label: string;
  color: string;
  icon: string;
}> = [
  { id: 'tech', label: 'Technology', color: '#00d9ff', icon: '⚡' },
  { id: 'health', label: 'Health & Wellness', color: '#00ff88', icon: '💚' },
  { id: 'finance', label: 'Finance & Business', color: '#ffb347', icon: '💰' },
  { id: 'news', label: 'News & Politics', color: '#b366ff', icon: '📰' },
  { id: 'entertainment', label: 'Entertainment', color: '#ff66cc', icon: '🎬' },
];

/**
 * Zod schema for Page 1 props
 * COMPLETE VERSION: Improved globe + Trend panels
 */
export const TrendPulsePage1PropsSchema = z.object({
  intro: IntroSectionPropsSchema.describe('Props for the intro section'),
  features: FeatureHighlightsPropsSchema.shape.features.describe('Features to showcase'),
  globe: GlobeContainerPropsSchema.describe('Props for the interactive 3D globe with trend hotspots'),
  trendPanels: z.object({
    topics: TrendingTopicsListPropsSchema.shape.topics.describe('Trending topics data from Tambo'),
    distribution: PlatformDistributionPanelPropsSchema.shape.distribution.describe('Platform distribution data from Tambo'),
    velocity: TrendVelocityPanelPropsSchema.shape.velocity.describe('Trend velocity data from Tambo'),
  }).describe('Data for all trend panels - sourced from Tambo'),
  researchCTA: z.object({
    headline: z.string().describe('CTA headline'),
    buttonText: z.string().describe('Button text')
  }).describe('Research Now CTA props'),
  pageStatus: z.enum(['idle', 'loading', 'ready']).describe('Overall page state'),
});

export type TrendPulsePage1Props = z.infer<typeof TrendPulsePage1PropsSchema>;

export function TrendPulsePage1({ 
  intro,
  features,
  globe,
  trendPanels,
  researchCTA,
  pageStatus 
}: TrendPulsePage1Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="trendpulse-page">
      {/* Page Status Indicator */}
      <div className="page-status" data-status={pageStatus}>
        {pageStatus === 'loading' && <div className="status-pulse" />}
      </div>

      {/* 1️⃣ INTRO SECTION */}
      <IntroSection {...intro} />

      {/* 2️⃣ FEATURE HIGHLIGHTS */}
      <FeatureHighlights features={features} />

      {/* 3️⃣ IMPROVED GLOBE SECTION with Category Sidebar */}
      <section className="globe-section-improved">
        <div className="section-marker">
          <span className="marker-label">Trend Universe</span>
        </div>

        <div className="globe-layout">
          {/* Main Globe Container */}
          <div className="globe-main">
            <GlobeContainer {...globe} hoveredCategory={hoveredCategory || undefined} />
          </div>

          {/* Vertical Category Sidebar */}
          <aside className="category-sidebar">
            <div className="category-header">
              <h3 className="category-title">Categories</h3>
              <p className="category-subtitle">Hover to highlight</p>
            </div>

            <div className="category-list">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`category-item ${hoveredCategory === category.id ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    '--category-color': category.color,
                  } as React.CSSProperties}
                >
                  <span className="category-icon">{category.icon}</span>
                  <div className="category-content">
                    <span className="category-label">{category.label}</span>
                    <div className="category-indicator" />
                  </div>
                </button>
              ))}
            </div>

            <div className="category-hint">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none"
                className="hint-icon"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="hint-text">
                Node size indicates trend popularity
              </span>
            </div>
          </aside>
        </div>

        {/* Stats Summary */}
        <div className="globe-stats">
          <div className="stat-item">
            <span className="stat-value">{globe.hotspots.length}</span>
            <span className="stat-label">Active Trends</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Live</span>
            <span className="stat-label">Real-time Data</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Global</span>
            <span className="stat-label">Coverage</span>
          </div>
        </div>
      </section>

      {/* 4️⃣ TREND PANELS SECTION */}
      <section className="trend-panels-section">
        <div className="trend-panels-container">
          <div className="section-marker">
            <span className="marker-label">Trend Analytics Dashboard</span>
          </div>

          <div className="trend-panels-grid">
            {/* Panel 1: Trending Topics List */}
            <TrendingTopicsList 
              topics={trendPanels.topics}
              title="Trending Topics"
            />

            {/* Panel 2: Platform Distribution */}
            <PlatformDistributionPanel 
              distribution={trendPanels.distribution}
              title="Platform Distribution"
            />

            {/* Panel 3: Trend Velocity */}
            <TrendVelocityPanel 
              velocity={trendPanels.velocity}
              title="Trend Velocity"
            />
          </div>
        </div>
      </section>

      {/* 5️⃣ RESEARCH NOW CTA */}
      <ResearchNowCTA {...researchCTA} />
    </div>
  );
}