import { callOpenRouter } from './llmService';

interface FileNode {
  name: string;
  path: string;
  type: string;
  children?: FileNode[];
}

interface CodeSummary {
  totalFiles?: number;
  classes?: any[];
  functions?: any[];
  services?: any[];
  modules?: any[];
  [key: string]: any;
}

export async function generateOnboardingGuide(
  fileTree: FileNode[],
  codeSummary: CodeSummary,
  dependencyGraph: unknown,
  architectureExplanation: string
): Promise<string> {

  // PERFORMANCE RULE: Limit data size sent to the LLM
  
  // 1. Truncate file tree (extract just major directories to avoid huge lists)
  const majorDirs = fileTree
    .filter(f => f.type === 'dir' || f.type === 'folder' || f.children)
    .map(d => ({
      name: d.name,
      path: d.path,
      childCount: d.children?.length || 0
    }));

  // 2. Include only top 30 modules/services/classes/functions
  const limitedSummary = { ...codeSummary };
  if (Array.isArray(limitedSummary.modules)) limitedSummary.modules = limitedSummary.modules.slice(0, 30);
  if (Array.isArray(limitedSummary.services)) limitedSummary.services = limitedSummary.services.slice(0, 30);
  if (Array.isArray(limitedSummary.classes)) limitedSummary.classes = limitedSummary.classes.slice(0, 30);
  if (Array.isArray(limitedSummary.functions)) limitedSummary.functions = limitedSummary.functions.slice(0, 30);

  // 3. Include top 50 dependencies to avoid token overflow
  let limitedDeps = dependencyGraph;
  if (dependencyGraph && typeof dependencyGraph === 'object') {
     const entries = Object.entries(dependencyGraph);
     if (entries.length > 50) {
       limitedDeps = Object.fromEntries(entries.slice(0, 50));
     }
  }

  const promptTemplate = `You are a senior software architect.

A developer has just joined this repository.

Using the provided repository analysis, generate a **New Developer Guide**.

Include the following sections:

1. Project Overview
   Explain the architecture style.

2. Where to Start
   Explain which file or module a developer should read first.

3. Core Architecture Layers
   Explain controllers, services, repositories, utilities etc.

4. Key Components
   List the most important modules and their purpose.

5. Important Directories
   Explain what each major directory contains.

6. Request Flow Example
   Describe how a typical request moves through the system.

7. Suggested Reading Order
   Provide a list of 5–10 files that should be read first.

Write the explanation clearly and concisely for a new developer.

---

### Analysis Data:

Architecture Explanation:
${architectureExplanation}

Major Directories:
${JSON.stringify(majorDirs, null, 2)}

Code Summary (Limited to Top 30 items per category):
${JSON.stringify(limitedSummary, null, 2)}

Dependencies (Limited to Top 50):
${JSON.stringify(limitedDeps, null, 2)}
`;

  // Provide exactly the model from the prompt instructions
  return await callOpenRouter(promptTemplate, 'deepseek/deepseek-r1');
}
