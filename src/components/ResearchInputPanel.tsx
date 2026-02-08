import React from 'react';
import { z } from 'zod';

/**
 * Zod schema for ResearchInputPanel props
 * Designed for Tambo integration later
 */
export const ResearchInputPanelPropsSchema = z.object({
  onSubmit: z.function()
    .args(z.string())
    .returns(z.void())
    .describe('Callback when user submits research query'),
  isProcessing: z.boolean().default(false).describe('Whether research is currently processing'),
  placeholder: z.string().default('What trend would you like to research?').describe('Input placeholder text'),
});

export type ResearchInputPanelProps = z.infer<typeof ResearchInputPanelPropsSchema>;

/**
 * ResearchInputPanel Component
 * 
 * PURPOSE:
 * - Focused input area for research queries
 * - NOT a chat interface
 * - Single-purpose: capture user intent
 * - No message history or streaming
 */
export function ResearchInputPanel({ 
  onSubmit, 
  isProcessing,
  placeholder 
}: ResearchInputPanelProps) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim() && !isProcessing) {
      onSubmit(query.trim());
      setQuery(''); // Clear input after submission
    }
  };

  return (
    <div className="research-input-panel">
      {/* Header */}
      <div className="input-panel-header">
        <h2 className="input-panel-title">Research a Trend</h2>
        <p className="input-panel-description">
          Ask questions about trends, topics, or content ideas. 
          Get AI-powered insights to guide your creative strategy.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="research-form">
        {/* Text Area */}
        <textarea
          className="research-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
          rows={6}
        />

        {/* Example Queries */}
        <div className="example-queries">
          <span className="example-label">Try asking:</span>
          <div className="example-list">
            <button
              type="button"
              className="example-query"
              onClick={() => setQuery("What's trending in science this week?")}
              disabled={isProcessing}
            >
              "What's trending in science this week?"
            </button>
            <button
              type="button"
              className="example-query"
              onClick={() => setQuery("What video should I make about AI?")}
              disabled={isProcessing}
            >
              "What video should I make about AI?"
            </button>
            <button
              type="button"
              className="example-query"
              onClick={() => setQuery("Show me rising topics in gaming")}
              disabled={isProcessing}
            >
              "Show me rising topics in gaming"
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="research-submit-button"
          disabled={!query.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="button-spinner">⏳</span>
              Analyzing...
            </>
          ) : (
            <>
              <span className="button-icon">🔍</span>
              Research
            </>
          )}
        </button>
      </form>

      {/* Helper Text */}
      <div className="input-panel-footer">
        <p className="footer-hint">
          <span className="hint-icon">💡</span>
          Results will appear in the insight panels on the left
        </p>
      </div>
    </div>
  );
}

export default ResearchInputPanel;