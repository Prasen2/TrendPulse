import { z } from 'zod';

/**
 * Zod schema for Intro Section props
 * Every dynamic element is controlled by Tambo
 */
export const IntroSectionPropsSchema = z.object({
  title: z.string().describe('Main headline - product value proposition'),
  description: z.string().describe('Clear explanation of what TrendPulse does'),
  subtleHint: z.string().describe('Progression cue text (e.g. "Scroll to explore")'),
  introState: z.enum(['idle', 'ready']).describe('Controls progression cue visibility - ready shows cue, idle hides it'),
});

export type IntroSectionProps = z.infer<typeof IntroSectionPropsSchema>;


export function IntroSection({ 
  title, 
  description, 
  subtleHint,
  introState 
}: IntroSectionProps) {
  return (
    <section className="intro-section">
      <div className="intro-content">
        {/* Main Headline */}
        <h1 className="intro-title">{title}</h1>
        
        {/* Value Proposition */}
        <p className="intro-description">{description}</p>
        
        {/* Progression Cue - Tambo-controlled visibility */}
        <div 
          className="progression-cue"
          data-state={introState}
        >
          <span className="progression-text">{subtleHint}</span>
          <div className="progression-arrow">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 5V19M12 19L5 12M12 19L19 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Section Boundary - Clear visual separation */}
      <div className="intro-boundary" />
    </section>
  );
}