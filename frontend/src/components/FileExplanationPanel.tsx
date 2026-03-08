'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Props {
  repoUrl: string;
  filePath: string | null;
}

const FileExplanationPanel: React.FC<Props> = ({ repoUrl, filePath }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!filePath) return;

    const explainFile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post('http://localhost:3001/api/explain-file', {
          repoUrl,
          filePath,
        }, { timeout: 120000 });
        setExplanation(res.data.explanation);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch explanation.');
        }
      } finally {
        setLoading(false);
      }
    };

    explainFile();
  }, [repoUrl, filePath]);

  if (!filePath) {
    return (
      <div className="glass-card-static" style={{
        padding: '40px 24px', height: '100%', minHeight: '300px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1" style={{ marginBottom: '16px', opacity: 0.5 }}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
        </svg>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
          Select a file from the explorer<br />to see AI-powered analysis
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card-static" style={{
      padding: '24px', height: '100%', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>File Analysis</h3>
      </div>
      
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#64748b',
        padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
        marginBottom: '16px', wordBreak: 'break-all'
      }}>
        {filePath}
      </div>
      
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
            <div className="shimmer" style={{ height: '16px', width: '90%' }} />
            <div className="shimmer" style={{ height: '16px', width: '75%' }} />
            <div className="shimmer" style={{ height: '16px', width: '85%' }} />
            <div className="shimmer" style={{ height: '16px', width: '60%' }} />
            <div className="shimmer" style={{ height: '16px', width: '80%' }} />
            <div className="shimmer" style={{ height: '16px', width: '70%' }} />
          </div>
        ) : error ? (
          <div style={{
            padding: '16px', borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)',
            color: '#fca5a5', fontSize: '13px'
          }}>
            {error}
          </div>
        ) : (
          <div className="prose prose-invert" style={{ maxWidth: 'none', fontSize: '13px' }}>
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplanationPanel;
