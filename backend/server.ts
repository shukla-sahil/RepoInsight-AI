import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { cloneRepository, cleanupRepository } from './repoCloner';
import { analyzeCode } from './codeAnalyzer';
import { generateDependencyGraph } from './dependencyAnalyzer';
import { generateArchitectureExplanation, explainFile, askCodebase } from './llmService';
import { generateMermaidDiagram } from './diagramGenerator';
import { scanRepository } from './repoScanner';
import { generateOnboardingGuide } from './onboardingGenerator';
import fs from 'fs';

import axios from 'axios';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const CACHE: Record<string, unknown> = {};

app.post('/api/analyze', async (req, res) => {
  const { repoUrl } = req.body;
  
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required.' });
  }

  if (CACHE[repoUrl]) {
    return res.json(CACHE[repoUrl]);
  }

  const repoId = `repo-${Date.now()}`;
  const repoPath = path.join(__dirname, 'repos', repoId);

  try {
    console.log(`Cloning repository ${repoUrl}...`);
    await cloneRepository(repoUrl, repoPath);

    console.log(`Scanning repository structure...`);
    const fileTree = scanRepository(repoPath);

    console.log(`Analyzing code with ts-morph...`);
    const codeSummary = analyzeCode(repoPath);

    console.log(`Generating dependency graph...`);
    const dependencyGraph = await generateDependencyGraph(repoPath);

    console.log(`Generating Mermaid diagrams...`);
    const diagram = generateMermaidDiagram(dependencyGraph);

    console.log(`Calling LLM for architecture explanation...`);
    const architectureExplanation = await generateArchitectureExplanation(codeSummary);

    console.log(`Generating Codebase Onboarding Guide...`);
    const onboardingGuide = await generateOnboardingGuide(
      fileTree,
      codeSummary,
      dependencyGraph,
      architectureExplanation
    );

    const result = {
      fileTree,
      codeSummary,
      dependencyGraph,
      diagram,
      architectureExplanation,
      onboardingGuide
    };

    CACHE[repoUrl] = result;
    
    // Attempting cleanup
    await cleanupRepository(repoPath);

    res.json(result);
  } catch (error: unknown) {
    console.error('Error analyzing repository:', error);
    await cleanupRepository(repoPath);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis.';
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/explain-file', async (req, res) => {
  const { repoUrl, filePath } = req.body;
  if (!repoUrl || !filePath) {
    return res.status(400).json({ error: 'repoUrl and filePath are required.' });
  }

  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (!match) throw new Error('Invalid GitHub URL');
    const [, owner, repo] = match;

    console.log(`[Explain] Fetching file: ${owner}/${repo}/${filePath}`);
    
    let fileContent = '';
    
    // Try fetching from raw GitHub URLs (no auth needed for public repos)
    // Try common branch names: main, master, HEAD
    const branches = ['main', 'master', 'HEAD'];
    let fetched = false;
    
    for (const branch of branches) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
        console.log(`[Explain] Trying: ${rawUrl}`);
        const rawRes = await axios.get(rawUrl, { timeout: 15000 });
        fileContent = typeof rawRes.data === 'string' ? rawRes.data : JSON.stringify(rawRes.data, null, 2);
        console.log(`[Explain] Success with branch: ${branch}`);
        fetched = true;
        break;
      } catch {
        continue;
      }
    }

    if (!fetched) {
      throw new Error(`Could not fetch file "${filePath}" from any branch (main/master/HEAD). The file may not exist in the repository.`);
    }

    const explanation = await explainFile(filePath, fileContent);
    res.json({ explanation });
  } catch (error: unknown) {
    console.error('[Explain] Error:', error instanceof Error ? error.message : error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/ask', async (req, res) => {
  const { repoUrl, question } = req.body;
  if (!repoUrl || !question) {
    return res.status(400).json({ error: 'repoUrl and question are required.' });
  }

  const cached = CACHE[repoUrl] as { codeSummary?: unknown; dependencyGraph?: unknown; architectureExplanation?: string } | undefined;
  if (!cached) {
    return res.status(404).json({ error: 'Repository has not been analyzed yet. Please analyze it first.' });
  }

  try {
    console.log(`[Ask] Question about ${repoUrl}: ${question.substring(0, 80)}...`);
    const answer = await askCodebase(
      question,
      cached.codeSummary,
      cached.dependencyGraph,
      cached.architectureExplanation || ''
    );
    res.json({ answer });
  } catch (error: unknown) {
    console.error('[Ask] Error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to answer question.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
