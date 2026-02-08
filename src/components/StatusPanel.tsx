import { z } from 'zod';

/**
 * Define props schema using Zod
 * This schema validates props that Tambo AI will pass to the component
 */
export const StatusPanelPropsSchema = z.object({
  status: z.string().describe('Current status of the application'),
  message: z.string().describe('Status message to display'),
});

export type StatusPanelProps = z.infer<typeof StatusPanelPropsSchema>;


export function StatusPanel({ status, message }: StatusPanelProps) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Status Panel</h2>
      <div>
        <strong>Status:</strong> {status}
      </div>
      <div>
        <strong>Message:</strong> {message}
      </div>
    </div>
  );
}