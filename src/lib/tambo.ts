import { TamboComponent } from '@tambo-ai/react';
import { TrendPulsePage1, TrendPulsePage1PropsSchema } from '../components/TrendPulsePage1';
import { GlobeContainer, GlobeContainerPropsSchema } from '../components/GlobeContainer';
import { TrendingTopicsList, TrendingTopicsListPropsSchema } from '../components/TrendingTopicsList';
import { PlatformDistributionPanel, PlatformDistributionPanelPropsSchema } from '../components/PlatformDistributionPanel';
import { TrendVelocityPanel, TrendVelocityPanelPropsSchema } from '../components/TrendVelocityPanel';


export const tamboComponents: TamboComponent[] = [
  {
    name: 'TrendPulsePage1',
    description: 'Main TrendPulse landing page with refined intro section and interactive 3D globe displaying trend hotspots. The globe visualizes real-time trend data through color-coded markers positioned at geographic coordinates. Hotspot data is fully controlled by Tambo and updates reactively.',
    component: TrendPulsePage1,
    propsSchema: TrendPulsePage1PropsSchema,
  },
  {
    name: 'GlobeContainer',
    description: 'Interactive 3D globe component with Tambo-orchestrated behavior and data visualization. Displays trend hotspots as glowing markers on the globe surface. Each hotspot has a category (tech/health/finance/news/entertainment) that determines its color, and an intensity (0-1) that controls size and opacity. Hotspots are positioned using lat/lng coordinates. The globe auto-rotates when idle (controlled by autoRotationSpeed). User can drag to manually rotate (if enableInteraction is true). Auto-rotation pauses during interaction and resumes after resumeDelayMs milliseconds. Hotspot data updates trigger immediate visual re-rendering without remounting.',
    component: GlobeContainer,
    propsSchema: GlobeContainerPropsSchema,
  },
  {
    name: 'TrendingTopicsList',
    description: 'Persistent panel that displays a list of trending topics. Each topic shows: name, category (tech/health/finance/news/entertainment with color coding), score (0-100), and velocity (rising/stable/falling). Topics are ranked by their position in the list. The component NEVER sorts, filters, or fetches data - it only renders the topics array provided by Tambo. When Tambo updates the topics array, this panel re-renders immediately. Use this to prove that Tambo controls list content and ordering.',
    component: TrendingTopicsList,
    propsSchema: TrendingTopicsListPropsSchema,
  },
  {
    name: 'PlatformDistributionPanel',
    description: 'Persistent panel that shows discussion volume distribution across platforms (YouTube, X/Twitter, Reddit, News Sites). Displays a horizontal stacked bar chart where each segment width represents the platform percentage. Shows percentage and absolute count for each platform, plus total discussion volume. The component NEVER calculates percentages or aggregates data - it only renders the distribution object provided by Tambo. When Tambo updates platform data, this chart updates immediately. Use this to prove multi-component orchestration alongside other trend panels.',
    component: PlatformDistributionPanel,
    propsSchema: PlatformDistributionPanelPropsSchema,
  },
  {
    name: 'TrendVelocityPanel',
    description: 'Persistent panel that displays overall trend velocity (acceleration/deceleration). Shows current velocity value (-100 to +100), direction (rising/stable/falling), percent change from previous period, and a simple line graph of historical velocity over time. The component NEVER calculates velocity or derives trend direction - it only renders the velocity object provided by Tambo. When Tambo updates velocity data, the graph and indicators update immediately. Use this to demonstrate time-series data orchestration and prove multiple panels update together.',
    component: TrendVelocityPanel,
    propsSchema: TrendVelocityPanelPropsSchema,
  },
];