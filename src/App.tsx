import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { TamboProvider } from '@tambo-ai/react';
import { tamboComponents } from './lib/tambo';
import { TrendPulsePage1 } from './components/TrendPulsePage1';
import { ResearchCopilotPage } from './components/ResearchCopilotPage';
import { INITIAL_FAKE_HOTSPOTS, updateFakeHotspots } from './lib/fakeHotspots';
import { getInitialTrendData, updateAllTrendData, TrendData } from './lib/fakeTrendData';
import { 
  INITIAL_RESEARCH_STATE, 
  TamboResearchState, 
} from './lib/fakeResearchData';
import { submitIntent } from './lib/tamboOrchestrator';
import { Hotspot } from './types/hotspot';
import './styles.css';
import './styles/trendPanels.css';
import './styles/researchCopilot.css';


function AppContent() {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY || '';
  

  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_FAKE_HOTSPOTS);
  const [trendData, setTrendData] = useState<TrendData>(getInitialTrendData());

  const [researchState, setResearchState] = useState<TamboResearchState>(INITIAL_RESEARCH_STATE);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * PAGE 1: Coordinated trend data updates 
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setHotspots(currentHotspots => updateFakeHotspots(currentHotspots));
      setTrendData(currentData => updateAllTrendData(currentData));
    }, 8000);

    return () => clearInterval(interval);
  }, []);


  const handleResearchSubmit = async (query: string) => {
    console.log('🔍 Research intent sent to Tambo conductor:', query);

    setIsProcessing(true);

    try {

      await submitIntent(
        { type: 'research_request', query },
        (updates) => {

          console.log('📊 TAMBO UPDATE:', updates);
          setResearchState(prevState => ({
            ...prevState,
            ...updates,
          }));
        }
      );

      console.log('✅ Research orchestration complete');
    } catch (err) {
      console.error('Research orchestration error', err);
      setResearchState(prev => ({
        ...prev,
        researchStatus: 'error',
        statusMessage: 'Research failed - try again',
        lastUpdated: new Date().toISOString(),
      }));
    } finally {
      setIsProcessing(false);
    }
  };


  const page1Props = {
    intro: {
      title: "See what the world is talking about",
      description: "Track emerging conversations before they become headlines. Understand what matters to people across the globe, spot patterns early, and stay ahead of the curve.",
      subtleHint: "Scroll to explore",
      introState: 'ready' as const
    },
    features: [
      {
        icon: "🌍",
        title: "Global Conversations",
        description: "Monitor real-time discussions happening across continents and cultures."
      },
      {
        icon: "📈",
        title: "Trend Analysis",
        description: "Identify patterns and emerging topics before they hit mainstream."
      },
      {
        icon: "🎯",
        title: "Smart Insights",
        description: "Get actionable intelligence on what matters most to your audience."
      },
      {
        icon: "⚡",
        title: "Real-Time Updates",
        description: "Stay current with live data streaming from around the world."
      }
    ],
    globe: {
      radius: 250,
      color: '#4adfff',
      opacity: 0.9,
      wireframe: true,
      autoRotationSpeed: 0.002,
      enableInteraction: true,
      resumeDelayMs: 1500,
      hotspots: hotspots
    },
    trendPanels: {
      topics: trendData.topics,
      distribution: trendData.distribution,
      velocity: trendData.velocity,
    },
    researchCTA: {
      headline: "Ready to explore?",
      buttonText: "Research Now",
      onNavigate: () => navigate("/research")
    },
    pageStatus: 'ready' as const
  };

 
  const page2Props = {
    topicSummary: {
      summaryText: researchState.summaryText,
      topicName: researchState.topicName,
      lastUpdated: researchState.lastUpdated,
    },
    keywords: {
      keywords: researchState.keywords,
      maxKeywords: 8,
    },
    videoAngles: {
      angles: researchState.videoIdeas,
      maxAngles: 5,
    },
    status: {
      status: researchState.researchStatus,
      statusMessage: researchState.statusMessage,
      confidenceScore: researchState.confidenceScore,
      dataPoints: researchState.dataPoints,
    },
  };

  if (!apiKey) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#0a0e15',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            ⚠️ Tambo API Key Required
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1.125rem',
            marginBottom: '0.5rem'
          }}>
            Please set your <code style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>VITE_TAMBO_API_KEY</code> environment variable.
          </p>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.875rem'
          }}>
            See the README for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider apiKey={apiKey} components={tamboComponents}>
      <Routes>
        <Route path="/" element={<TrendPulsePage1 {...page1Props} />} />
        <Route 
          path="/research" 
          element={
            <ResearchCopilotPage 
              {...page2Props}
              onResearchSubmit={handleResearchSubmit}
              isProcessing={isProcessing}
            />
          } 
        />
      </Routes>
    </TamboProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}