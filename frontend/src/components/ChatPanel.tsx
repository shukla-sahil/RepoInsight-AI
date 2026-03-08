'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  repoUrl: string;
}

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SparkleSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
    <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
  </svg>
);

const SUGGESTIONS = [
  "Where is authentication implemented?",
  "What are the main entry points?",
  "Which modules have the most dependencies?",
  "Are there any potential security issues?",
  "How is error handling structured?",
];

const ChatPanel: React.FC<ChatPanelProps> = ({ repoUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question?: string) => {
    const q = question || input.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: q, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await axios.post(`${API_URL}/api/ask`, {
        repoUrl,
        question: q,
      }, { timeout: 120000 });

      const assistantMsg: ChatMessage = { role: 'assistant', content: res.data.answer, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? (err.response?.data?.error || err.message)
        : (err instanceof Error ? err.message : 'Failed to get answer');
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card-static" style={{
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
      padding: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#06b6d4', fontSize: '14px',
        }}>
          💬
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
            Ask the Codebase
          </h3>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            AI-powered Q&A about this repository
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="custom-scrollbar" style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        minHeight: 0,
      }}>
        {messages.length === 0 ? (
          /* Empty state with suggestions */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '16px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px', fontWeight: 500 }}>
                Ask anything about this codebase
              </p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Try one of the suggestions below
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.08)',
                    color: '#94a3b8', fontSize: '12px', textAlign: 'left',
                    cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.08)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <SparkleSmall />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat messages */
          messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeInUp 0.3s ease-out',
            }}>
              <div style={{
                maxWidth: '90%',
                padding: msg.role === 'user' ? '10px 14px' : '12px 16px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))'
                  : 'rgba(30, 41, 59, 0.6)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(6,182,212,0.2)' : 'rgba(99,102,241,0.08)'}`,
                color: '#e2e8f0',
                fontSize: '13px',
              }}>
                {msg.role === 'user' ? (
                  <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                ) : (
                  <div className="prose prose-invert" style={{ maxWidth: 'none', fontSize: '13px' }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(99,102,241,0.08)',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#64748b',
                  animation: `float 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
      }}>
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask about the codebase..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(99, 102, 241, 0.1)',
              color: '#f1f5f9', fontSize: '13px', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)'}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: input.trim() ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(99, 102, 241, 0.08)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() ? 'white' : '#4b5563',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
