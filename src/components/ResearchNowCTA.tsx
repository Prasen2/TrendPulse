import { z } from 'zod';

/**
 * Zod schema for Research Now CTA
 */
export const ResearchNowCTAPropsSchema = z.object({
  headline: z.string().describe('CTA headline'),
  buttonText: z.string().describe('Button text'),
  onNavigate: z.function().args().returns(z.void()).optional().describe('Navigation handler')
});

export type ResearchNowCTAProps = z.infer<typeof ResearchNowCTAPropsSchema>;

/**
 * ResearchNowCTA Component
 */
export function ResearchNowCTA({ headline, buttonText, onNavigate }: ResearchNowCTAProps) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <section className="research-cta">
      <div className="research-cta-content">
        <h2 className="research-cta-headline">{headline}</h2>
        <button 
          className="research-cta-button"
          onClick={handleClick}
        >
          {buttonText}
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="research-cta-arrow"
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}