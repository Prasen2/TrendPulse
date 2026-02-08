import { z } from 'zod';
import { KeywordSchema } from '../types/keyword';
import { VideoAngleSchema } from '../types/videoAngle';



export const ResearchStatusSchema = z.enum(['idle', 'analyzing', 'complete', 'error']);
export type ResearchStatus = z.infer<typeof ResearchStatusSchema>;

export const TamboResearchStateSchema = z.object({
  // Research lifecycle status
  researchStatus: ResearchStatusSchema.describe('Current research phase'),
  statusMessage: z.string().describe('Human-readable status message'),
  
  // Research query context
  query: z.string().nullable().describe('User research query'),
  topicName: z.string().nullable().describe('Extracted topic name'),
  
  // Progressive research outputs
  summaryText: z.string().nullable().describe('AI-generated topic summary'),
  keywords: z.array(KeywordSchema).describe('Extracted keywords'),
  videoIdeas: z.array(VideoAngleSchema).describe('Video content suggestions'),
  
  // Research quality metrics
  confidenceScore: z.number().min(0).max(100).nullable().describe('Research confidence 0-100'),
  dataPoints: z.number().nullable().describe('Number of data points analyzed'),
  
  // Metadata
  lastUpdated: z.string().nullable().describe('ISO timestamp of last update'),
});

export type TamboResearchState = z.infer<typeof TamboResearchStateSchema>;

/**
 * INITIAL IDLE STATE
 * Everything is null/empty when no research has been performed
 */
export const INITIAL_RESEARCH_STATE: TamboResearchState = {
  researchStatus: 'idle',
  statusMessage: 'Ready to research',
  query: null,
  topicName: null,
  summaryText: null,
  keywords: [],
  videoIdeas: [],
  confidenceScore: null,
  dataPoints: null,
  lastUpdated: null,
};

/**
 * FAKE RESEARCH DATA GENERATORS
 * 
 * These simulate AI research outputs
 * In production, this would come from MCP + LLM
 */

const FAKE_SUMMARIES: Record<string, string> = {
  'ai': 'Artificial intelligence continues to dominate tech discussions, with particular focus on large language models, AI safety regulations, and the democratization of AI tools. Recent developments in open-source AI and concerns about job displacement are driving significant conversation volume.',
  'climate': 'Climate change remains a critical global topic with increasing urgency. Discussions center on renewable energy adoption, carbon capture technology, and international climate agreements. Youth activism and corporate sustainability commitments are emerging as key subtopics.',
  'crypto': 'Cryptocurrency markets show renewed interest following regulatory clarity in major economies. Bitcoin and Ethereum continue to lead discussions, while decentralized finance (DeFi) and NFT utility cases are evolving beyond initial hype cycles.',
  'health': 'Healthcare innovation is accelerating with focus on personalized medicine, mental health awareness, and preventive care technologies. Telehealth adoption remains strong post-pandemic, and wearable health devices are becoming mainstream.',
  'default': 'This topic is gaining traction across multiple platforms with diverse perspectives. Key themes include innovation, community engagement, and practical applications. Discussion volume indicates growing mainstream interest and potential for viral growth.',
};

const FAKE_KEYWORDS: Record<string, Array<{ text: string; relevance: number }>> = {
  'ai': [
    { text: 'ChatGPT', relevance: 95 },
    { text: 'Machine Learning', relevance: 88 },
    { text: 'AI Ethics', relevance: 82 },
    { text: 'Automation', relevance: 76 },
    { text: 'Neural Networks', relevance: 71 },
    { text: 'GPT-4', relevance: 68 },
    { text: 'AI Safety', relevance: 65 },
    { text: 'Deep Learning', relevance: 62 },
  ],
  'climate': [
    { text: 'Renewable Energy', relevance: 92 },
    { text: 'Carbon Emissions', relevance: 89 },
    { text: 'Climate Action', relevance: 85 },
    { text: 'Sustainability', relevance: 78 },
    { text: 'Green Technology', relevance: 73 },
    { text: 'Climate Crisis', relevance: 70 },
    { text: 'Solar Power', relevance: 66 },
    { text: 'Climate Policy', relevance: 63 },
  ],
  'crypto': [
    { text: 'Bitcoin', relevance: 94 },
    { text: 'Ethereum', relevance: 87 },
    { text: 'Blockchain', relevance: 83 },
    { text: 'DeFi', relevance: 79 },
    { text: 'Web3', relevance: 74 },
    { text: 'Crypto Regulation', relevance: 71 },
    { text: 'NFT', relevance: 67 },
    { text: 'Smart Contracts', relevance: 64 },
  ],
  'health': [
    { text: 'Mental Health', relevance: 91 },
    { text: 'Wellness', relevance: 86 },
    { text: 'Telemedicine', relevance: 81 },
    { text: 'Health Tech', relevance: 77 },
    { text: 'Fitness', relevance: 72 },
    { text: 'Nutrition', relevance: 69 },
    { text: 'Preventive Care', relevance: 65 },
    { text: 'Wearables', relevance: 61 },
  ],
  'default': [
    { text: 'Innovation', relevance: 85 },
    { text: 'Community', relevance: 78 },
    { text: 'Growth', relevance: 72 },
    { text: 'Engagement', relevance: 68 },
    { text: 'Technology', relevance: 64 },
    { text: 'Future', relevance: 60 },
  ],
};

const FAKE_VIDEO_IDEAS: Record<string, Array<{ title: string; angle: string; difficulty: 'easy' | 'medium' | 'hard'; estimatedViews: string }>> = {
  'ai': [
    {
      title: 'I Tested ChatGPT Against My Job for 24 Hours',
      angle: 'Personal experiment comparing AI vs human performance in real tasks',
      difficulty: 'medium',
      estimatedViews: '50K-150K',
    },
    {
      title: 'The AI Tools That Actually Changed My Life',
      angle: 'Practical guide to productivity-boosting AI tools with honest reviews',
      difficulty: 'easy',
      estimatedViews: '30K-80K',
    },
    {
      title: 'Why AI Will NOT Replace Humans (But This Will)',
      angle: 'Contrarian take on AI job displacement with nuanced analysis',
      difficulty: 'hard',
      estimatedViews: '100K-300K',
    },
    {
      title: 'Building a Business Using Only AI in 2024',
      angle: 'Case study documenting AI-powered business creation journey',
      difficulty: 'medium',
      estimatedViews: '60K-120K',
    },
  ],
  'climate': [
    {
      title: 'I Went Zero Waste for 30 Days – Here\'s What Happened',
      angle: 'Personal challenge documenting lifestyle changes and impact',
      difficulty: 'easy',
      estimatedViews: '40K-100K',
    },
    {
      title: 'The Climate Solutions Nobody Talks About',
      angle: 'Investigating underreported innovations in climate technology',
      difficulty: 'hard',
      estimatedViews: '80K-200K',
    },
    {
      title: 'How to Actually Reduce Your Carbon Footprint',
      angle: 'Data-driven guide to effective personal climate action',
      difficulty: 'medium',
      estimatedViews: '50K-120K',
    },
  ],
  'crypto': [
    {
      title: 'I Invested $1000 in Crypto – 1 Year Update',
      angle: 'Honest portfolio review with lessons learned',
      difficulty: 'easy',
      estimatedViews: '60K-150K',
    },
    {
      title: 'Crypto vs Traditional Finance: The Real Comparison',
      angle: 'Educational breakdown of advantages and disadvantages',
      difficulty: 'medium',
      estimatedViews: '70K-180K',
    },
    {
      title: 'The Future of Money Nobody Sees Coming',
      angle: 'Forward-looking analysis of blockchain adoption trends',
      difficulty: 'hard',
      estimatedViews: '90K-250K',
    },
  ],
  'default': [
    {
      title: 'What Everyone Gets Wrong About [Topic]',
      angle: 'Myth-busting common misconceptions with expert insights',
      difficulty: 'medium',
      estimatedViews: '40K-100K',
    },
    {
      title: 'I Tried [Topic] for 30 Days – Honest Review',
      angle: 'Personal experiment with daily documentation',
      difficulty: 'easy',
      estimatedViews: '30K-80K',
    },
    {
      title: 'The Hidden Truth About [Topic]',
      angle: 'Investigative deep-dive into lesser-known aspects',
      difficulty: 'hard',
      estimatedViews: '60K-150K',
    },
  ],
};

/**
 * Extract topic category from query
 * Simple keyword matching for demo purposes
 */
function extractTopicCategory(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence') || lowerQuery.includes('chatgpt') || lowerQuery.includes('machine learning')) {
    return 'ai';
  }
  if (lowerQuery.includes('climate') || lowerQuery.includes('environment') || lowerQuery.includes('sustainability') || lowerQuery.includes('green')) {
    return 'climate';
  }
  if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('blockchain') || lowerQuery.includes('web3')) {
    return 'crypto';
  }
  if (lowerQuery.includes('health') || lowerQuery.includes('wellness') || lowerQuery.includes('fitness') || lowerQuery.includes('medical')) {
    return 'health';
  }
  
  return 'default';
}

/**
 * Extract topic name from query
 * Simplified extraction for demo
 */
function extractTopicName(query: string): string {
  const category = extractTopicCategory(query);
  
  const categoryNames: Record<string, string> = {
    'ai': 'Artificial Intelligence',
    'climate': 'Climate Change',
    'crypto': 'Cryptocurrency',
    'health': 'Health & Wellness',
    'default': query.split(' ').slice(0, 3).join(' ').replace(/[?!.]/g, ''),
  };
  
  return categoryNames[category] || 'Trending Topic';
}

/**
 * Generate fake summary based on query
 */
export function generateFakeSummary(query: string): string {
  const category = extractTopicCategory(query);
  return FAKE_SUMMARIES[category] || FAKE_SUMMARIES.default;
}

/**
 * Generate fake keywords based on query
 */
export function generateFakeKeywords(query: string): Array<{ text: string; relevance: number }> {
  const category = extractTopicCategory(query);
  return FAKE_KEYWORDS[category] || FAKE_KEYWORDS.default;
}

/**
 * Generate fake video ideas based on query
 */
export function generateFakeVideoIdeas(query: string): Array<{ title: string; angle: string; difficulty: 'easy' | 'medium' | 'hard'; estimatedViews: string | null }> {
  const category = extractTopicCategory(query);
  const ideas = FAKE_VIDEO_IDEAS[category] || FAKE_VIDEO_IDEAS.default;
  
  return ideas.map(idea => ({
    ...idea,
    estimatedViews: idea.estimatedViews || null,
  }));
}

/**
 * Generate fake confidence score
 */
export function generateFakeConfidence(): number {
  // Random confidence between 65-95
  return Math.floor(Math.random() * 30) + 65;
}

/**
 * Generate fake data points count
 */
export function generateFakeDataPoints(): number {
  // Random count between 1000-5000
  return Math.floor(Math.random() * 4000) + 1000;
}


export async function simulateResearchFlow(
  query: string,
  onUpdate: (state: Partial<TamboResearchState>) => void
): Promise<void> {
  const topicName = extractTopicName(query);
  
  // STEP 1: Start analyzing
  onUpdate({
    researchStatus: 'analyzing',
    statusMessage: 'Analyzing topic...',
    query,
    topicName,
    summaryText: null,
    keywords: [],
    videoIdeas: [],
    confidenceScore: null,
    dataPoints: null,
    lastUpdated: new Date().toISOString(),
  });
  
  // STEP 2: Generate summary (after 800ms)
  await new Promise(resolve => setTimeout(resolve, 800));
  onUpdate({
    statusMessage: 'Generating summary...',
    summaryText: generateFakeSummary(query),
    lastUpdated: new Date().toISOString(),
  });
  
  // STEP 3: Extract keywords (after 600ms)
  await new Promise(resolve => setTimeout(resolve, 600));
  onUpdate({
    statusMessage: 'Extracting keywords...',
    keywords: generateFakeKeywords(query),
    lastUpdated: new Date().toISOString(),
  });
  
  // STEP 4: Generate video ideas (after 700ms)
  await new Promise(resolve => setTimeout(resolve, 700));
  onUpdate({
    statusMessage: 'Generating video ideas...',
    videoIdeas: generateFakeVideoIdeas(query),
    lastUpdated: new Date().toISOString(),
  });
  
  // STEP 5: Calculate confidence (after 500ms)
  await new Promise(resolve => setTimeout(resolve, 500));
  onUpdate({
    researchStatus: 'complete',
    statusMessage: 'Research complete',
    confidenceScore: generateFakeConfidence(),
    dataPoints: generateFakeDataPoints(),
    lastUpdated: new Date().toISOString(),
  });
}