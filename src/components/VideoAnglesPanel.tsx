import { z } from 'zod';

/**
 * Video Angle Schema
 */
export const VideoAngleSchema = z.object({
  title: z.string().describe('Suggested video title'),
  angle: z.string().describe('Content angle or hook'),
  estimatedViews: z.string().nullable().describe('Estimated view potential (e.g. "10K-50K")'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Production difficulty'),
});

export type VideoAngle = z.infer<typeof VideoAngleSchema>;

/**
 * Zod schema for VideoAnglesPanel props
 * Designed for Tambo to populate later
 */
export const VideoAnglesPanelPropsSchema = z.object({
  angles: z.array(VideoAngleSchema).describe('List of suggested video angles - empty when idle'),
  maxAngles: z.number().default(5).describe('Maximum angles to display'),
});

export type VideoAnglesPanelProps = z.infer<typeof VideoAnglesPanelPropsSchema>;

/**
 * VideoAnglesPanel Component
 * 
 * PURPOSE:
 * - Display AI-suggested video content ideas
 * - Always visible, never unmounts
 * - Shows empty state when idle
 * - Content populated by Tambo orchestration
 */
export function VideoAnglesPanel({ angles, maxAngles }: VideoAnglesPanelProps) {
  const isEmpty = angles.length === 0;
  const displayAngles = angles.slice(0, maxAngles);

  // Difficulty color mapping
  const difficultyConfig = {
    easy: { label: 'Easy', color: '#00ff88' },
    medium: { label: 'Medium', color: '#ffb347' },
    hard: { label: 'Hard', color: '#ff6b6b' },
  };

  return (
    <div className="insight-panel video-angles-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">🎬</span>
          <h3 className="panel-title">Suggested Video Angles</h3>
        </div>
        {!isEmpty && (
          <span className="panel-badge">{angles.length}</span>
        )}
      </div>

      {/* Panel Content */}
      <div className="panel-content">
        {isEmpty ? (
          // Placeholder state
          <div className="panel-placeholder">
            <div className="placeholder-icon">💡</div>
            <p className="placeholder-text">
              AI-generated video ideas will appear here
            </p>
            <p className="placeholder-hint">
              Each suggestion includes title, angle, and difficulty
            </p>
          </div>
        ) : (
          // Active state with video angles
          <div className="video-angles-list">
            {displayAngles.map((angle, index) => (
              <div key={index} className="video-angle-card">
                {/* Card Header */}
                <div className="angle-header">
                  <span className="angle-number">#{index + 1}</span>
                  <div 
                    className="angle-difficulty"
                    style={{ 
                      backgroundColor: `${difficultyConfig[angle.difficulty].color}20`,
                      color: difficultyConfig[angle.difficulty].color,
                      borderColor: difficultyConfig[angle.difficulty].color
                    }}
                  >
                    {difficultyConfig[angle.difficulty].label}
                  </div>
                </div>

                {/* Card Content */}
                <h4 className="angle-title">{angle.title}</h4>
                <p className="angle-description">{angle.angle}</p>

                {/* Card Footer */}
                {angle.estimatedViews && (
                  <div className="angle-footer">
                    <span className="angle-metric-label">Est. Views:</span>
                    <span className="angle-metric-value">{angle.estimatedViews}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}