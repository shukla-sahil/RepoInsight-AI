'use client';
import React from 'react';

const HeroAnimation: React.FC = () => {
  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto',
      aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.08)',
      background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
    }}>
      {/* Grid Background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated Connection Lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 900 506">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection paths from center to nodes */}
        <g filter="url(#glow)">
          {/* Center to top-left */}
          <line x1="450" y1="253" x2="140" y2="90" stroke="url(#lineGrad1)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          {/* Center to top-right */}
          <line x1="450" y1="253" x2="760" y2="90" stroke="url(#lineGrad2)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.5s" repeatCount="indefinite" />
          </line>
          {/* Center to left */}
          <line x1="450" y1="253" x2="100" y2="280" stroke="url(#lineGrad1)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
          </line>
          {/* Center to right */}
          <line x1="450" y1="253" x2="800" y2="280" stroke="url(#lineGrad2)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.8s" repeatCount="indefinite" />
          </line>
          {/* Center to bottom-left */}
          <line x1="450" y1="253" x2="180" y2="420" stroke="url(#lineGrad1)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.2s" repeatCount="indefinite" />
          </line>
          {/* Center to bottom-right */}
          <line x1="450" y1="253" x2="720" y2="420" stroke="url(#lineGrad2)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.8s" repeatCount="indefinite" />
          </line>
          {/* Cross connections */}
          <line x1="140" y1="90" x2="100" y2="280" stroke="url(#lineGrad3)" strokeWidth="0.8" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="760" y1="90" x2="800" y2="280" stroke="url(#lineGrad3)" strokeWidth="0.8" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4.5s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Traveling pulses along lines */}
        <circle r="3" fill="#06b6d4" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M450,253 L140,90" />
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#8b5cf6" filter="url(#glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M450,253 L760,90" />
          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#06b6d4" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M450,253 L100,280" />
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#8b5cf6" filter="url(#glow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M450,253 L800,280" />
          <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#10b981" filter="url(#glow)">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M450,253 L180,420" />
          <animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#10b981" filter="url(#glow)">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M450,253 L720,420" />
          <animate attributeName="opacity" values="0;1;0" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating Code Nodes */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Node: server.ts */}
        <CodeNode x="8%" y="10%" label="server.ts" color="#06b6d4" delay="0s" lines={['app.post("/api/analyze")', '  const repo = req.body;', '  return res.json(data);']} />
        {/* Node: App.tsx */}
        <CodeNode x="72%" y="8%" label="App.tsx" color="#8b5cf6" delay="0.3s" lines={['export default Home()', '  const [data] = useState()', '  return <Dashboard />']} />
        {/* Node: utils.js */}
        <CodeNode x="2%" y="45%" label="utils.js" color="#06b6d4" delay="0.6s" lines={['function analyze(repo)', '  const tree = scan()', '  return buildGraph()']} />
        {/* Node: api.ts */}
        <CodeNode x="78%" y="45%" label="api.ts" color="#8b5cf6" delay="0.9s" lines={['async fetchData(url)', '  const res = await get()', '  return parse(res)']} />
        {/* Node: model.py */}
        <CodeNode x="10%" y="75%" label="model.py" color="#10b981" delay="1.2s" lines={['class Analyzer:', '  def explain(self):', '    return llm.run()']} />
        {/* Node: schema.ts */}
        <CodeNode x="68%" y="75%" label="schema.ts" color="#10b981" delay="1.5s" lines={['interface FileNode {', '  name: string', '  children: Node[]']} />
      </div>

      {/* Center Logo */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          animation: 'pulseGlow 3s ease-in-out infinite',
        }} />
        {/* Rotating ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '110px', height: '110px', borderRadius: '50%',
          border: '1px solid transparent',
          borderTopColor: 'rgba(6, 182, 212, 0.4)',
          borderRightColor: 'rgba(139, 92, 246, 0.2)',
          animation: 'spin 8s linear infinite',
        }} />
        {/* Inner rotating ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95px', height: '95px', borderRadius: '50%',
          border: '1px solid transparent',
          borderBottomColor: 'rgba(139, 92, 246, 0.4)',
          borderLeftColor: 'rgba(6, 182, 212, 0.2)',
          animation: 'spin 6s linear infinite reverse',
        }} />
        {/* Logo */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '2px',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.2), 0 0 60px rgba(139, 92, 246, 0.1), inset 0 0 20px rgba(6, 182, 212, 0.05)',
        }}>
          <img src="/logo.svg" alt="RepoInsight AI" width={48} height={48} style={{ borderRadius: '8px' }} />
        </div>
      </div>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${10 + (i * 7.5)}%`,
            top: `${15 + ((i * 23) % 70)}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#10b981',
            opacity: 0.4,
            animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>
    </div>
  );
};

/* ==================== Code Node Component ==================== */
const CodeNode: React.FC<{
  x: string; y: string; label: string; color: string; delay: string; lines: string[];
}> = ({ x, y, label, color, delay, lines }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${color}30`,
    borderRadius: '10px',
    padding: '10px 12px',
    width: '175px',
    animation: `fadeInUp 0.8s ease-out ${delay} both, float ${4 + parseFloat(delay)}s ease-in-out infinite`,
    boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${color}10`,
    transition: 'border-color 0.3s, box-shadow 0.3s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = `${color}60`;
    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 25px ${color}25`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = `${color}30`;
    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${color}10`;
  }}>
    {/* Title bar */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px',
      paddingBottom: '5px', borderBottom: `1px solid ${color}15`
    }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', opacity: 0.7 }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
      </div>
      <span style={{ fontSize: '9px', fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>
        {label}
      </span>
    </div>
    {/* Code lines */}
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', lineHeight: 1.7 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ color: '#64748b', marginRight: '6px', userSelect: 'none' }}>{i + 1}</span>
          {colorize(line)}
        </div>
      ))}
    </div>
  </div>
);

/* Simple keyword syntax highlighting */
function colorize(line: string): React.ReactNode {
  const keywords = ['const', 'return', 'async', 'await', 'function', 'export', 'default', 'class', 'def', 'self', 'interface'];
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let keyIdx = 0;

  while (remaining.length > 0) {
    let earliestIdx = remaining.length;
    let earliestKw = '';

    for (const kw of keywords) {
      const idx = remaining.indexOf(kw);
      if (idx !== -1 && idx < earliestIdx) {
        earliestIdx = idx;
        earliestKw = kw;
      }
    }

    if (earliestKw) {
      if (earliestIdx > 0) {
        parts.push(<span key={keyIdx++} style={{ color: '#cbd5e1' }}>{remaining.slice(0, earliestIdx)}</span>);
      }
      parts.push(<span key={keyIdx++} style={{ color: '#c084fc' }}>{earliestKw}</span>);
      remaining = remaining.slice(earliestIdx + earliestKw.length);
    } else {
      // Check for strings
      const strMatch = remaining.match(/("[^"]*"|'[^']*')/);
      if (strMatch && strMatch.index !== undefined) {
        if (strMatch.index > 0) {
          parts.push(<span key={keyIdx++} style={{ color: '#cbd5e1' }}>{remaining.slice(0, strMatch.index)}</span>);
        }
        parts.push(<span key={keyIdx++} style={{ color: '#34d399' }}>{strMatch[0]}</span>);
        remaining = remaining.slice(strMatch.index + strMatch[0].length);
      } else {
        parts.push(<span key={keyIdx++} style={{ color: '#cbd5e1' }}>{remaining}</span>);
        break;
      }
    }
  }

  return <>{parts}</>;
}

export default HeroAnimation;
