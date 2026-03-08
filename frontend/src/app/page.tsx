"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Mermaid from "../components/Mermaid";
import FileTree, { FileNode } from "../components/FileTree";
import FileExplanationPanel from "../components/FileExplanationPanel";
import HeroAnimation from "../components/HeroAnimation";
import ChatPanel from "../components/ChatPanel";

interface AnalysisData {
  fileTree: FileNode[];
  architectureExplanation: string;
  onboardingGuide?: string;
  diagram: string;
}

/* ==================== SVG Icons ==================== */
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const FileTreeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    <line x1="9" y1="14" x2="15" y2="14"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A5.5 5.5 0 004 7.5c0 1.33.47 2.55 1.26 3.5H4a3 3 0 00-1 5.83V17a4 4 0 004 4h1"/>
    <path d="M14.5 2A5.5 5.5 0 0120 7.5c0 1.33-.47 2.55-1.26 3.5H20a3 3 0 011 5.83V17a4 4 0 01-4 4h-1"/>
    <path d="M12 2v20"/>
  </svg>
);

const GraphIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="18" r="3"/>
    <line x1="8.5" y1="7.5" x2="15.5" y2="16.5"/>
    <line x1="15.5" y1="7.5" x2="8.5" y2="16.5"/>
  </svg>
);

const BookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"/>
  </svg>
);

/* ==================== Loading States ==================== */
const LoadingOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(8px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    zIndex: 50, gap: '24px'
  }}>
    <div className="spinner" />
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
        Analyzing Repository...
      </p>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>
        Cloning, scanning files, generating architecture insights
      </p>
    </div>
  </div>
);

const ShimmerBlock = ({ height = '20px', width = '100%' }: { height?: string, width?: string }) => (
  <div className="shimmer" style={{ height, width, marginBottom: '8px' }} />
);

/* ==================== Feature Card ==================== */
const FeatureCard = ({ icon, title, desc, color, delay }: { icon: React.ReactNode, title: string, desc: string, color: string, delay: string }) => (
  <div className="glass-card animate-fade-in-up" style={{ padding: '32px 24px', opacity: 0, animationDelay: delay, animationFillMode: 'forwards' }}>
    <div className="feature-icon" style={{ background: `${color}15`, color }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#f1f5f9' }}>{title}</h3>
    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

/* ==================== Main Page ==================== */
export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!repoUrl) return;
    setLoading(true);
    setError("");
    setData(null);
    setSelectedFile(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await axios.post(`${API_URL}/api/analyze`, { repoUrl }, { timeout: 300000 });
      setData(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze();
    }
  };

  const handleBack = () => {
    setData(null);
    setError("");
    setSelectedFile(null);
  };

  return (
    <>
      <div className="animated-bg" />
      
      {loading && <LoadingOverlay />}

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        
        {/* ==================== NAVBAR ==================== */}
        <nav className="nav-container" style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleBack}>
            <img
              src="/logo.svg"
              alt="RepoInsight AI"
              width={36}
              height={36}
              style={{
                borderRadius: '10px',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(360deg) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
            />
            <span style={{ fontSize: '20px', fontWeight: 700 }} className="gradient-text">RepoInsight AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#94a3b8', transition: 'color 0.2s' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              <GitHubIcon />
            </a>
          </div>
        </nav>

        {/* ==================== HERO SECTION (shown when no data) ==================== */}
        {!data && (
          <div className="hero-container">
            
            {/* Hero */}
            <section style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '40px' }}>
              <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '100px',
                  background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)',
                  fontSize: '13px', color: '#06b6d4', marginBottom: '28px', fontWeight: 500
                }}>
                  <SparkleIcon /> Powered by AI
                </div>
              </div>

              <h1 className="animate-fade-in-up gradient-text-glow" style={{
                fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800,
                lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em',
                opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards'
              }}>
                Understand Any Codebase<br />In Seconds
              </h1>

              <p className="animate-fade-in-up" style={{
                fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px',
                lineHeight: 1.7, opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards'
              }}>
                Paste a GitHub URL and let AI analyze the architecture, map dependencies, and explain every file — instantly.
              </p>

              {/* Search Bar */}
              <div className="hero-search-container animate-fade-in-up" style={{
                opacity: 0, animationDelay: '0.3s', animationFillMode: 'forwards'
              }}>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://github.com/owner/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !repoUrl}
                  className="btn-primary"
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Analyze <ArrowRight />
                </button>
              </div>

              {error && (
                <div className="animate-scale-in" style={{
                  maxWidth: '680px', margin: '16px auto 0',
                  padding: '14px 20px', borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5', fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
            </section>

            {/* Animated Hero Visualization */}
            <section className="animate-fade-in-up" style={{
              margin: '0 auto 80px', opacity: 0,
              animationDelay: '0.4s', animationFillMode: 'forwards'
            }}>
              <HeroAnimation />
            </section>

            {/* Features */}
            <section style={{ paddingBottom: '100px' }}>
              <h2 className="gradient-text animate-fade-in-up" style={{
                textAlign: 'center', fontSize: '32px', fontWeight: 700,
                marginBottom: '48px', opacity: 0, animationDelay: '0.5s', animationFillMode: 'forwards'
              }}>
                Everything You Need
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <FeatureCard
                  icon={<FileTreeIcon />}
                  title="File Explorer"
                  desc="Browse the entire repository structure with an interactive file tree. Click any file to get an AI-powered explanation."
                  color="#06b6d4"
                  delay="0.5s"
                />
                <FeatureCard
                  icon={<BrainIcon />}
                  title="AI Architecture Analysis"
                  desc="Get a comprehensive breakdown of the codebase architecture, service layers, design patterns, and improvement suggestions."
                  color="#8b5cf6"
                  delay="0.6s"
                />
                <FeatureCard
                  icon={<GraphIcon />}
                  title="Dependency Mapping"
                  desc="Visualize module dependencies with auto-generated diagrams. Understand how components connect at a glance."
                  color="#10b981"
                  delay="0.7s"
                />
              </div>
            </section>
          </div>
        )}

        {/* ==================== ANALYSIS DASHBOARD ==================== */}
        {data && (
          <div className="dashboard-container">
            
            {/* Dashboard Header */}
            <div className="animate-fade-in" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={handleBack} style={{
                background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', color: '#94a3b8',
                fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = '#94a3b8'; }}>
                ← Back
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Analysis Results</h1>
                <p style={{ fontSize: '13px', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{repoUrl}</p>
              </div>
            </div>

            {/* Dashboard Grid - Top Row */}
            <div className="dashboard-grid-top">
              
              {/* File Explorer */}
              <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ color: '#06b6d4' }}><FileTreeIcon /></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>File Explorer</h2>
                </div>
                <div className="custom-scrollbar" style={{ flex: 1, maxHeight: '500px', overflowY: 'auto' }}>
                  <FileTree 
                    nodes={data.fileTree} 
                    onFileClick={(path: string) => setSelectedFile(path)} 
                    selectedPath={selectedFile}
                  />
                </div>
              </div>

              {/* Chat Panel */}
              <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards', height: '100%', minHeight: '500px' }}>
                <ChatPanel repoUrl={repoUrl} />
              </div>

              {/* File Explanation Panel */}
              <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.3s', animationFillMode: 'forwards', height: '100%', minHeight: '500px' }}>
                <FileExplanationPanel repoUrl={repoUrl} filePath={selectedFile} />
              </div>
            </div>

            {/* Dependency Graph & Architecture - Bottom Row */}
            <div className="dashboard-grid-bottom">
              
              {/* Architecture Explanation */}
              <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '0.4s', animationFillMode: 'forwards', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ color: '#8b5cf6' }}><BrainIcon /></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Architecture Overview</h2>
                </div>
                <div className="custom-scrollbar prose prose-invert" style={{ flex: 1, maxHeight: '500px', overflowY: 'auto', maxWidth: 'none', fontSize: '14px' }}>
                  <ReactMarkdown>{data.architectureExplanation}</ReactMarkdown>
                </div>
              </div>

              {/* Dependency Graph */}
              <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '0.5s', animationFillMode: 'forwards', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ color: '#10b981' }}><GraphIcon /></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Dependency Graph</h2>
                </div>
                {data.diagram ? (
                  <div style={{
                    background: 'rgba(255,255,255,0.95)', borderRadius: '12px',
                    padding: '24px', overflow: 'auto', flex: 1, minHeight: '300px', maxHeight: '500px'
                  }}>
                    <Mermaid chart={data.diagram} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <GraphIcon />
                    <p style={{ marginTop: '12px', fontSize: '14px' }}>
                      No module dependencies found. This is common for simple projects without module imports.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Codebase Onboarding Guide — Full Width */}
            {data.onboardingGuide && (
              <div className="glass-card-static animate-fade-in-up" style={{
                padding: '32px', marginTop: '24px', opacity: 0, animationDelay: '0.6s', animationFillMode: 'forwards'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ color: '#f59e0b', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
                    <BookIcon />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Codebase Onboarding Guide</h2>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>New developer structured overview</p>
                  </div>
                </div>
                <div className="custom-scrollbar prose prose-invert" style={{
                  maxWidth: 'none', 
                  fontSize: '15px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.1)'
                }}>
                  <ReactMarkdown>{data.onboardingGuide}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
