import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { TopicSummaryPanel, TopicSummaryPanelPropsSchema } from './TopicSummaryPanel';
import { KeyKeywordsPanel, KeyKeywordsPanelPropsSchema } from './KeyKeywordsPanel';
import { VideoAnglesPanel, VideoAnglesPanelPropsSchema } from './VideoAnglesPanel';
import { ResearchStatusPanel, ResearchStatusPanelPropsSchema } from './ResearchStatusPanel';
import { ResearchInputPanel } from './ResearchInputPanel';

/**
 * Zod schema for ResearchCopilotPage props
 * All insight panel data designed for Tambo orchestration
 */
export const ResearchCopilotPagePropsSchema = z.object({
  topicSummary: TopicSummaryPanelPropsSchema.describe('Topic summary panel data'),
  keywords: KeyKeywordsPanelPropsSchema.describe('Keywords panel data'),
  videoAngles: VideoAnglesPanelPropsSchema.describe('Video angles panel data'),
  status: ResearchStatusPanelPropsSchema.describe('Research status panel data'),
  onResearchSubmit: z.function().args(z.string()).returns(z.promise(z.void())).describe('Research submit handler from Tambo'),
  isProcessing: z.boolean().describe('Whether research is currently processing'),
});

export type ResearchCopilotPageProps = z.infer<typeof ResearchCopilotPagePropsSchema>;

/**
 * ResearchCopilotPage Component - PAGE 2
 * AI-powered research workspace for creators
 */
export function ResearchCopilotPage({
  topicSummary,
  keywords,
  videoAngles,
  status,
  onResearchSubmit,
  isProcessing,
}: ResearchCopilotPageProps) {
  const navigate = useNavigate();

  /**
   * Handle research query submission
   */
  const handleResearchSubmit = async (query: string) => {
    console.log('🔍 User query:', query);
    console.log('📤 Forwarding to Tambo orchestration...');
    
    await onResearchSubmit(query);
    
    console.log('✅ Tambo orchestration complete');
  };

  return (
    <div className="research-copilot-page">
      {/* Page Navigation */}
      <header className="page-header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/')}
            className="back-link"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 0,
            }}
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back to Trends</span>
          </button>
          <h1 className="page-heading">Research Copilot</h1>
        </div>
      </header>

      {/* Two-Column Layout */}
      <div className="page-layout">
        {/* LEFT PANEL - Research Insights (PRIMARY) */}
        <aside className="insights-panel-container">
          <div className="insights-panel-inner">
            {/* Section Label */}
            <div className="section-label">
              <span className="label-icon">📊</span>
              <span className="label-text">Research Insights</span>
            </div>

            {/* Insight Panels (ALWAYS RENDERED) */}
            <div className="insights-stack">
              <TopicSummaryPanel {...topicSummary} />
              <KeyKeywordsPanel {...keywords} />
              <VideoAnglesPanel {...videoAngles} />
              <ResearchStatusPanel {...status} />
            </div>

            {/* Orchestration Debug Info (Remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'monospace',
              }}>
                <div>Research Status: {status.status}</div>
                <div>Keywords: {keywords.keywords.length}</div>
                <div>Video Ideas: {videoAngles.angles.length}</div>
                <div>Processing: {isProcessing ? 'Yes' : 'No'}</div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL - Research Input (SECONDARY) */}
        <main className="input-panel-container">
          <div className="input-panel-inner">
            <ResearchInputPanel
              onSubmit={handleResearchSubmit}
              isProcessing={isProcessing}
              placeholder="What trend would you like to research?"
            />
          </div>
        </main>
      </div>
    </div>
  );
}