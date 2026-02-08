import { TamboResearchState } from './fakeResearchData';
import { simulateResearchFlow } from './fakeResearchData';


export type ResearchIntent = {
  type: 'research_request';
  query: string;
  region?: string;
};

export async function submitIntent(
  intent: ResearchIntent,
  onUpdate: (state: Partial<TamboResearchState>) => void
): Promise<void> {
  if (!intent || intent.type !== 'research_request' || !intent.query) {
    // Invalid intent — set error state
    onUpdate({
      researchStatus: 'error',
      statusMessage: 'Invalid research request',
      lastUpdated: new Date().toISOString(),
    });
    return;
  }

  // Immediately set analyzing status and clear old results
  onUpdate({
    researchStatus: 'analyzing',
    statusMessage: 'Interpreting request...',
    query: intent.query,
    topicName: null,
    summaryText: null,
    keywords: [],
    videoIdeas: [],
    confidenceScore: null,
    dataPoints: null,
    lastUpdated: new Date().toISOString(),
  });

  try {
    // Use the fake research simulation to produce progressive updates
    await simulateResearchFlow(intent.query, onUpdate);
  } catch (err) {
    console.error('[Orchestrator] Error:', err);
    onUpdate({
      researchStatus: 'error',
      statusMessage: 'Research failed - please try again',
      lastUpdated: new Date().toISOString(),
    });
  }
}
