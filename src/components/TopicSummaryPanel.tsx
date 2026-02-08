import { z } from 'zod';

/**
 * Zod schema for TopicSummaryPanel props
 * Designed for Tambo to populate later
 */
export const TopicSummaryPanelPropsSchema = z.object({
  summaryText: z.string().nullable().describe('AI-generated topic summary - null when idle'),
  topicName: z.string().nullable().describe('Name of the researched topic - null when idle'),
  lastUpdated: z.string().nullable().describe('ISO timestamp of last update - null when idle'),
});

export type TopicSummaryPanelProps = z.infer<typeof TopicSummaryPanelPropsSchema>;



export function TopicSummaryPanel({ summaryText, topicName, lastUpdated }: TopicSummaryPanelProps) {
  const isEmpty = !summaryText;

  return (
    <div className="insight-panel topic-summary-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">📋</span>
          <h3 className="panel-title">Topic Summary</h3>
        </div>
        {lastUpdated && (
          <span className="panel-timestamp">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Panel Content */}
      <div className="panel-content">
        {isEmpty ? (
          // Placeholder state
          <div className="panel-placeholder">
            <div className="placeholder-icon">📊</div>
            <p className="placeholder-text">
              Topic summary will appear here once research begins.
            </p>
            <p className="placeholder-hint">
              Enter a research query to get started
            </p>
          </div>
        ) : (
          // Active state with content
          <div className="summary-content">
            {topicName && (
              <div className="summary-topic">
                <span className="topic-label">Topic:</span>
                <span className="topic-name">{topicName}</span>
              </div>
            )}
            <div className="summary-text">
              {summaryText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}