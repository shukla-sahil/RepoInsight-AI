'use client';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

let mermaidInitialized = false;
let renderCount = 0;

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current || !chart || !chart.trim()) return;

    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
      });
      mermaidInitialized = true;
    }

    const id = `mermaid_chart_${renderCount++}`;

    const renderChart = async () => {
      try {
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const { svg } = await mermaid.render(id, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (e: unknown) {
        console.error('Mermaid rendering failed:', e);
        const broken = document.getElementById(id);
        if (broken) broken.remove();
        const brokenD = document.getElementById(`d${id}`);
        if (brokenD) brokenD.remove();
        setError(e instanceof Error ? e.message : String(e));
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Diagram could not be rendered</p>
        <details style={{ fontSize: '12px' }}>
          <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Show details</summary>
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: '8px', padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>{error}</pre>
        </details>
      </div>
    );
  }

  return <div ref={ref} style={{ overflow: 'auto', minHeight: '100px' }}></div>;
};

export default Mermaid;
