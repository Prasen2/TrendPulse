import { z } from 'zod';
import { TrendingTopicSchema } from '../types/trendData';
import { getCategoryColor } from '../types/hotspot';

/**
 * Zod schema for TrendingTopicsList props
 * All data comes from Tambo
 */
export const TrendingTopicsListPropsSchema = z.object({
  topics: z.array(TrendingTopicSchema).describe('List of trending topics from Tambo'),
  title: z.string().default('Trending Topics').describe('Panel title'),
});

export type TrendingTopicsListProps = z.infer<typeof TrendingTopicsListPropsSchema>;

/**
 * TrendingTopicsList Component
 * 
 * PURPOSE:
 * - Display top trending topics
 * - Show category, score, and velocity
 * - Prove Tambo controls list content
 */
export function TrendingTopicsList({ topics, title }: TrendingTopicsListProps) {
  return (
    <div className="trend-panel trending-topics-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <span className="panel-badge">{topics.length}</span>
      </div>

      {/* Topics List */}
      <div className="topics-list">
        {topics.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <p className="empty-text">No trending topics</p>
          </div>
        ) : (
          topics.map((topic, index) => (
            <div key={topic.id} className="topic-item">
              {/* Rank */}
              <div className="topic-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>

              {/* Topic Content */}
              <div className="topic-content">
                <div className="topic-header">
                  <h4 className="topic-name">{topic.name}</h4>
                  <div 
                    className="topic-category"
                    style={{ 
                      backgroundColor: `${getCategoryColor(topic.category)}20`,
                      color: getCategoryColor(topic.category),
                      borderColor: getCategoryColor(topic.category)
                    }}
                  >
                    {topic.category}
                  </div>
                </div>

                <div className="topic-metrics">
                  {/* Score */}
                  <div className="metric">
                    <span className="metric-label">Score</span>
                    <span className="metric-value">{topic.score}</span>
                  </div>

                  {/* Velocity Indicator */}
                  <div className="metric">
                    <span className="metric-label">Velocity</span>
                    <div className="velocity-indicator" data-direction={topic.velocity}>
                      {topic.velocity === 'rising' && '↗ Rising'}
                      {topic.velocity === 'stable' && '→ Stable'}
                      {topic.velocity === 'falling' && '↘ Falling'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Bar */}
              <div className="topic-score-bar">
                <div 
                  className="score-fill"
                  style={{ 
                    width: `${topic.score}%`,
                    backgroundColor: getCategoryColor(topic.category)
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}