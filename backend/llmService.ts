import axios from 'axios';

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// Free models to try in order of preference (largest/best first)
const FREE_MODELS = [
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
];

export const generateArchitectureExplanation = async (codeSummary: unknown) => {
  const prompt = `
Explain the architecture of this codebase based on the following summary:       
${JSON.stringify(codeSummary, null, 2)}

Please strictly include sections:
* Overall architecture style
* Major modules
* Service layers
* Dependency relationships
* Routing structure
* Possible design issues
* Suggestions for improvement
`;

  return await callOpenRouter(prompt);
};

export const explainFile = async (filePath: string, fileContent: string) => {   
  const prompt = `
Explain this file for a developer.
File path: ${filePath}

File content:
${fileContent}

Include:
* Purpose
* Dependencies
* Main logic
* Possible improvements
`;

  return await callOpenRouter(prompt);
};

export const askCodebase = async (
  question: string,
  codeSummary: unknown,
  dependencyGraph: unknown,
  architectureExplanation: string
) => {
  const prompt = `You are an expert code assistant analyzing a repository. You have deep knowledge of this codebase from the analysis below. Answer the developer's question accurately and concisely. Use markdown formatting. Reference specific files, modules, and code patterns when relevant.

## Codebase Analysis Context

### Architecture Overview:
${architectureExplanation}

### Code Summary (files, classes, functions):
${JSON.stringify(codeSummary, null, 2)}

### Dependency Graph:
${JSON.stringify(dependencyGraph, null, 2)}

---

## Developer Question:
${question}

Answer:`;

  return await callOpenRouter(prompt);
};

export const callOpenRouter = async (prompt: string, customModel?: string): Promise<string> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return `### AI Explanation (Mocked Response)

> **Note:** A valid OpenRouter API key was not found. Please add it to your \`.env\` file.

* **Overall Architecture Style:** Component-based modular structure.
* **Major Modules:** Core services, routes, and entry points.
* **Possible Improvements:** Add valid OpenRouter API key for in-depth AI analysis.`;
  }

  // Try each model in order until one succeeds
  const modelsToTry = customModel ? [customModel, ...FREE_MODELS.filter(m => m !== customModel)] : FREE_MODELS;
  
  for (const model of modelsToTry) {
    try {
      console.log(`[LLM] Trying model: ${model}...`);
      const response = await axios.post(
        API_ENDPOINT,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'RepoInsight AI'
          },
          timeout: 120000, // 2 minute timeout for LLM calls
        }
      );

      const message = response.data?.choices?.[0]?.message;
      if (!message) {
        console.error(`[LLM] Unexpected response from ${model}:`, JSON.stringify(response.data, null, 2));
        continue; // Try next model
      }

      // Get content — some reasoning models put the answer in reasoning_content
      let content = message.content || '';

      // If content is empty, fall back to reasoning_content (e.g. DeepSeek R1)
      if (!content.trim() && message.reasoning_content) {
        content = message.reasoning_content;
      }

      // Strip <think>...</think> tags that some providers embed inline
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      if (!content) {
        console.error(`[LLM] Empty content from ${model}:`, JSON.stringify(response.data, null, 2));
        continue; // Try next model
      }

      console.log(`[LLM] Successfully received response from ${model}.`);
      return content;
    } catch (error: unknown) {
      console.error(`[LLM] Error with model ${model}:`, error instanceof Error ? error.message : error);
      // For any error (rate limit, timeout, provider error), try next model
      continue;
    }
  }

  // All models failed
  return '### AI Explanation Unavailable\n\nAll free AI models are currently unavailable. The rest of the analysis (file tree, code summary, dependency graph, and diagrams) is still available above.\n\nPlease try again later or add OpenRouter credits for premium models.';
};