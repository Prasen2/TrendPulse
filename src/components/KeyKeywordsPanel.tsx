import { z } from 'zod';

/**
 * Keyword Schema
 */
export const KeywordSchema = z.object({
  text: z.string().describe('Keyword text'),
  relevance: z.number().min(0).max(100).describe('Relevance score 0-100'),
});

export type Keyword = z.infer<typeof KeywordSchema>;

/**
 * Zod schema for KeyKeywordsPanel props
 * Designed for Tambo to populate later
 */
export const KeyKeywordsPanelPropsSchema = z.object({
  keywords: z.array(KeywordSchema).describe('List of extracted keywords - empty when idle'),
  maxKeywords: z.number().default(8).describe('Maximum keywords to display'),
});

export type KeyKeywordsPanelProps = z.infer<typeof KeyKeywordsPanelPropsSchema>;

/**
 * KeyKeywordsPanel Component
 * 
 * PURPOSE:
 * - Display AI-extracted keywords from research
 * - Always visible, never unmounts
 * - Shows empty state when idle
 * - Content populated by Tambo orchestration
 */
export function KeyKeywordsPanel({ keywords, maxKeywords }: KeyKeywordsPanelProps) {
  const isEmpty = keywords.length === 0;
  const displayKeywords = keywords.slice(0, maxKeywords);

  return (
    <div className="insight-panel key-keywords-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">🔑</span>
          <h3 className="panel-title">Key Keywords</h3>
        </div>
        {!isEmpty && (
          <span className="panel-badge">{keywords.length}</span>
        )}
      </div>

      {/* Panel Content */}
      <div className="panel-content">
        {isEmpty ? (
          // Placeholder state
          <div className="panel-placeholder">
            <div className="placeholder-icon">🏷️</div>
            <p className="placeholder-text">
              Important keywords will be extracted here
            </p>
            <p className="placeholder-hint">
              These help identify core themes and topics
            </p>
          </div>
        ) : (
          // Active state with keywords
          <div className="keywords-grid">
            {displayKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="keyword-tag"
                data-relevance={
                  keyword.relevance >= 80 ? 'high' :
                  keyword.relevance >= 50 ? 'medium' : 'low'
                }
              >
                <span className="keyword-text">{keyword.text}</span>
                <span className="keyword-score">{keyword.relevance}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}