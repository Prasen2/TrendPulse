import { z } from 'zod';

/**
 * Zod schema for Feature Highlights
 */
export const FeatureHighlightsPropsSchema = z.object({
  features: z.array(z.object({
    icon: z.string().describe('Emoji or icon for the feature'),
    title: z.string().describe('Feature title'),
    description: z.string().describe('Brief description')
  })).describe('List of features to highlight')
});

export type FeatureHighlightsProps = z.infer<typeof FeatureHighlightsPropsSchema>;


export function FeatureHighlights({ features }: FeatureHighlightsProps) {
  return (
    <section className="feature-highlights">
      <div className="features-container">
        <h2 className="features-heading">What you can do</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}