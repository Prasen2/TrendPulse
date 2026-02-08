import { z } from 'zod';
import { TrendVelocitySchema, getVelocityColor } from '../types/trendData';

/**
 * Zod schema for TrendVelocity props
 * All data comes from Tambo
 */
export const TrendVelocityPanelPropsSchema = z.object({
  velocity: TrendVelocitySchema.describe('Velocity data from Tambo'),
  title: z.string().default('Trend Velocity').describe('Panel title'),
});

export type TrendVelocityPanelProps = z.infer<typeof TrendVelocityPanelPropsSchema>;

/**
 * TrendVelocityPanel Component
 * 
 * PURPOSE:
 * - Display overall trend acceleration/deceleration
 * - Show velocity direction and magnitude
 * - Render simple time series graph
 * - Prove Tambo controls velocity data
 */
export function TrendVelocityPanel({ velocity, title }: TrendVelocityPanelProps) {
  const { current, direction, history, changePercent } = velocity;

  // Calculate min/max for graph scaling
  const values = history.map(d => d.value);
  const minValue = Math.min(...values, -20);
  const maxValue = Math.max(...values, 20);
  const range = maxValue - minValue;

  return (
    <div className="trend-panel velocity-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <div 
          className="velocity-badge"
          style={{ 
            backgroundColor: `${getVelocityColor(direction)}20`,
            color: getVelocityColor(direction),
            borderColor: getVelocityColor(direction)
          }}
        >
          {direction === 'rising' && '↗ Rising'}
          {direction === 'stable' && '→ Stable'}
          {direction === 'falling' && '↘ Falling'}
        </div>
      </div>

      {/* Current Velocity Indicator */}
      <div className="velocity-current">
        <div className="velocity-value-container">
          <span className="velocity-label">Current Velocity</span>
          <span 
            className="velocity-value"
            style={{ color: getVelocityColor(direction) }}
          >
            {current > 0 ? '+' : ''}{current}
          </span>
        </div>

        {/* Change Percentage */}
        <div className="velocity-change">
          <span className={`change-value ${changePercent >= 0 ? 'positive' : 'negative'}`}>
            {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(1)}%
          </span>
          <span className="change-label">vs previous period</span>
        </div>
      </div>

      {/* Simple Line Graph */}
      <div className="velocity-graph">
        <svg width="100%" height="120" className="velocity-chart">
          {/* Zero line */}
          <line
            x1="0"
            y1="60"
            x2="100%"
            y2="60"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Velocity line */}
          <polyline
            fill="none"
            stroke={getVelocityColor(direction)}
            strokeWidth="2"
            points={history.map((point, index) => {
              const x = (index / (history.length - 1)) * 100;
              const normalizedValue = (point.value - minValue) / range;
              const y = 120 - (normalizedValue * 120);
              return `${x}%,${y}`;
            }).join(' ')}
          />

          {/* Data points */}
          {history.map((point, index) => {
            const x = (index / (history.length - 1)) * 100;
            const normalizedValue = (point.value - minValue) / range;
            const y = 120 - (normalizedValue * 120);
            return (
              <circle
                key={point.timestamp}
                cx={`${x}%`}
                cy={y}
                r="3"
                fill={getVelocityColor(direction)}
                opacity={index === history.length - 1 ? 1 : 0.5}
              />
            );
          })}
        </svg>

        {/* Graph Labels */}
        <div className="graph-labels">
          <span className="label-left">
            {history[0] ? new Date(history[0].timestamp).toLocaleTimeString() : ''}
          </span>
          <span className="label-right">
            {history[history.length - 1] ? new Date(history[history.length - 1].timestamp).toLocaleTimeString() : ''}
          </span>
        </div>
      </div>

      {/* Velocity Scale Reference */}
      <div className="velocity-scale">
        <div className="scale-item">
          <span className="scale-dot" style={{ backgroundColor: '#ff6b6b' }} />
          <span className="scale-label">Falling (&lt; -20)</span>
        </div>
        <div className="scale-item">
          <span className="scale-dot" style={{ backgroundColor: '#4a9eff' }} />
          <span className="scale-label">Stable (-20 to +20)</span>
        </div>
        <div className="scale-item">
          <span className="scale-dot" style={{ backgroundColor: '#00ff88' }} />
          <span className="scale-label">Rising (&gt; +20)</span>
        </div>
      </div>
    </div>
  );
}