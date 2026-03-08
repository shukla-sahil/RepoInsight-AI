'use client';
import React, { useState } from 'react';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick: (path: string) => void;
  selectedPath?: string | null;
  level?: number;
}

const FolderIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={open ? '#06b6d4' : '#8b5cf6'} strokeWidth="1.5" style={{ flexShrink: 0, transition: 'all 0.2s' }}>
    {open ? (
      <>
        <path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.5 19l2.5-7h13l-2.5 7H4.5z" fill="rgba(6,182,212,0.1)"/>
      </>
    ) : (
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="rgba(139,92,246,0.08)" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

const FileIcon = ({ name }: { name: string }) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  let color = '#64748b';
  if (['ts', 'tsx'].includes(ext)) color = '#3b82f6';
  else if (['js', 'jsx'].includes(ext)) color = '#eab308';
  else if (['css', 'scss'].includes(ext)) color = '#8b5cf6';
  else if (['html'].includes(ext)) color = '#f97316';
  else if (['json'].includes(ext)) color = '#10b981';
  else if (['md'].includes(ext)) color = '#94a3b8';

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FileTree: React.FC<FileTreeProps> = ({ nodes, onFileClick, selectedPath, level = 0 }) => {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: level > 0 ? '16px' : 0 }}>
      {nodes.map((node) => (
        <TreeNode key={node.path} node={node} onFileClick={onFileClick} selectedPath={selectedPath} level={level} />
      ))}
    </ul>
  );
};

const TreeNode = ({ node, onFileClick, selectedPath, level }: { node: FileNode, onFileClick: (path: string) => void, selectedPath?: string | null, level: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <li>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          color: isSelected ? '#06b6d4' : '#cbd5e1',
          background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
          transition: 'all 0.15s ease',
          borderLeft: isSelected ? '2px solid #06b6d4' : '2px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
            e.currentTarget.style.color = '#f1f5f9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#cbd5e1';
          }
        }}
      >
        {node.type === 'directory' ? (
          <>
            <ChevronIcon open={isOpen} />
            <FolderIcon open={isOpen} />
          </>
        ) : (
          <>
            <span style={{ width: '12px' }} />
            <FileIcon name={node.name} />
          </>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
      </div>
      {node.type === 'directory' && isOpen && node.children && (
        <FileTree nodes={node.children} onFileClick={onFileClick} selectedPath={selectedPath} level={level + 1} />
      )}
    </li>
  );
};

export default FileTree;
