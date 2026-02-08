import { z } from 'zod';

/**
 * Research Status Values
 */
export const ResearchStatusSchema = z.enum([
  'idle',
  'analyzing',
  'complete',
  'error'
]).describe('Current research status');

export type ResearchStatus = z.infer<typeof ResearchStatusSchema>;

/**
 * Zod schema for ResearchStatusPanel props
 * Designed for Tambo to populate later
 */
export const ResearchStatusPanelPropsSchema = z.object({
  status: ResearchStatusSchema.describe('Current research status'),
  statusMessage: z.string().describe('Human-readable status message'),
  confidenceScore: z.number().min(0).max(100).nullable().describe('Research confidence 0-100 - null when idle'),
  dataPoints: z.number().nullable().describe('Number of data points analyzed - null when idle'),
});

export type ResearchStatusPanelProps = z.infer<typeof ResearchStatusPanelPropsSchema>;

/**
 * ResearchStatusPanel Component
 * 
 * PURPOSE:
 * - Display current research status and confidence
 * - Always visible, never unmounts
 * - Shows idle state by default
 */
export function ResearchStatusPanel({ 
  status, 
  statusMessage, 
  confidenceScore,
  dataPoints 
}: ResearchStatusPanelProps) {
  // Status configuration
  const statusConfig = {
    idle: { label: 'Idle', color: '#4a9eff', icon: '⏸️' },
    analyzing: { label: 'Analyzing', color: '#ffb347', icon: '🔍' },
    complete: { label: 'Complete', color: '#00ff88', icon: '✓' },
    error: { label: 'Error', color: '#ff6b6b', icon: '⚠️' },
  };

  const currentConfig = statusConfig[status];

  return (
    <div className="insight-panel research-status-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">📊</span>
          <h3 className="panel-title">Research Status</h3>
        </div>
      </div>

      {/* Panel Content */}
      <div className="panel-content">
        {/* Status Indicator */}
        <div className="status-indicator">
          <div 
            className="status-badge"
            style={{
              backgroundColor: `${currentConfig.color}20`,
              color: currentConfig.color,
              borderColor: currentConfig.color
            }}
          >
            <span className="status-icon">{currentConfig.icon}</span>
            <span className="status-label">{currentConfig.label}</span>
          </div>
          <p className="status-message">{statusMessage}</p>
        </div>

        {/* Confidence Score (when available) */}
        {confidenceScore !== null && (
          <div className="confidence-section">
            <div className="confidence-header">
              <span className="confidence-label">Confidence Score</span>
              <span className="confidence-value">{confidenceScore}%</span>
            </div>
            
            {/* Confidence Bar */}
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ 
                  width: `${confidenceScore}%`,
                  backgroundColor: 
                    confidenceScore >= 80 ? '#00ff88' :
                    confidenceScore >= 60 ? '#ffb347' : '#ff6b6b'
                }}
              />
            </div>

            {/* Confidence Interpretation */}
            <p className="confidence-interpretation">
              {confidenceScore >= 80 && 'High confidence - results are reliable'}
              {confidenceScore >= 60 && confidenceScore < 80 && 'Moderate confidence - results are useful'}
              {confidenceScore < 60 && 'Low confidence - limited data available'}
            </p>
          </div>
        )}

        {/* Data Points (when available) */}
        {dataPoints !== null && (
          <div className="data-points-section">
            <div className="data-points-row">
              <span className="data-points-label">Data Points Analyzed</span>
              <span className="data-points-value">{dataPoints.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Idle State Helper */}
        {status === 'idle' && (
          <div className="idle-helper">
            <p className="helper-text">
              Ready to analyze trends. Enter a research query to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}