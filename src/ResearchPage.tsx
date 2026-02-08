import { TamboProvider, useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { tamboComponents } from './lib/tambo';
import './styles.css';

/**
 * Research Interface with Tambo
 */
function ResearchInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0e15',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 14, 21, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#ffffff',
            margin: 0
          }}>
            TrendPulse Research
          </h1>
          <a 
            href="/" 
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#4a9eff'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: '2rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Message Thread */}
        <div style={{ 
          minHeight: '400px',
          marginBottom: '2rem'
        }}>
          {thread.messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              padding: '4rem 2rem',
              textAlign: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  fontWeight: 600
                }}>
                  Start your research
                </h2>
                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  Ask questions, explore trends, or request specific data visualizations.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '1rem',
                  fontWeight: 500
                }}>
                  Try asking:
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'left'
                }}>
                  <div>"What are the trending topics today?"</div>
                  <div>"Show me global sentiment analysis"</div>
                  <div>"Visualize conversation patterns"</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {thread.messages.map((message) => (
                <div 
                  key={message.id} 
                  style={{ 
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: message.role === 'user' 
                      ? 'rgba(74, 158, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid ' + (
                      message.role === 'user' 
                        ? 'rgba(74, 158, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.08)'
                    )
                  }}
                >
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: '0.75rem', 
                    textTransform: 'capitalize',
                    color: message.role === 'user' ? '#4a9eff' : '#ffffff',
                    fontSize: '0.875rem'
                  }}>
                    {message.role}
                  </div>
                  <div>
                    {Array.isArray(message.content) ? (
                      message.content.map((part, i) =>
                        part.type === 'text' ? (
                          <p key={i} style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
                            {part.text}
                          </p>
                        ) : null
                      )
                    ) : (
                      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
                        {String(message.content)}
                      </p>
                    )}
                  </div>
                  {message.renderedComponent && (
                    <div style={{ marginTop: '1.5rem' }}>
                      {message.renderedComponent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Bar - Fixed at bottom */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 14, 21, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem 2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <form onSubmit={handleSubmit} style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask anything about global trends..."
            disabled={isPending}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '1rem',
              color: '#e4e6eb',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(74, 158, 255, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <button
            type="submit"
            disabled={isPending || !value.trim()}
            style={{
              padding: '1rem 2rem',
              background: isPending ? 'rgba(74, 158, 255, 0.3)' : '#4a9eff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'background 0.2s',
              opacity: isPending || !value.trim() ? 0.5 : 1
            }}
          >
            {isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Research Page (Page 2)
 */
function ResearchPage() {
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY as string || '';

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
          <h1 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '1rem' }}>
            ⚠️ Tambo API Key Required
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.125rem' }}>
            Please set your VITE_TAMBO_API_KEY environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider apiKey={apiKey} components={tamboComponents}>
      <ResearchInterface />
    </TamboProvider>
  );
}

export default ResearchPage;