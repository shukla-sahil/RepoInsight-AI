# RepoInsight AI

RepoInsight AI is a powerful developer tool that analyzes public GitHub repositories and intuitively explains their architecture using AI. It provides an automated, visual, and analytical dashboard for understanding complex codebases such as Angular, Node, React, and TypeScript.

## Features

- **Automated Repository Cloning:** Securely fetches and processes any public 50MB+ codebase.
- **Code Structure Analysis:** Identifies modules, classes, and services automatically using `ts-morph`.
- **Dependency Graph:** Visualizes dependency connections within the codebase using `madge`.
- **AI Architecture Explanation:** Uses OpenRouter (`deepseek-coder`) to generate plain-english insights for overall architectures.
- **File System Explanation:** Select any file deeply nested from the tree, and the AI will analyze its logic, purpose, imports, and suggest improvements.
- **Dynamic Diagrams:** Presents architectural relationships using Mermaid.js embedded diagrams.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, `ts-morph`, `madge`, `simple-git`
- **Frontend:** Next.js (React), Tailwind CSS, `mermaid.js`
- **AI Model:** OpenRouter API (`deepseek/deepseek-r1`)

## Installation Instructions

Follow these steps to run the complete stack locally.

### 1. Configure Environment variables

In the root directory of this project (`repoinsight-ai`), an `.env` file should have been generated. If not, create one:

```env
GITHUB_TOKEN=github_pat_123456
OPENROUTER_API_KEY=sk-or-v1-123456
PORT=3001
```

*(Note: Replace with your actual valid API keys to allow the OpenRouter completion and Github requests)*

### 2. Setup & Run Backend

Open a terminal and run the following commands:

```bash
cd repoinsight-ai/backend
npm install
npm run dev
```
*(If `npm run dev` is not configured, run `npx ts-node server.ts`)*

The backend server should now be running on `http://localhost:3001`.

### 3. Setup & Run Frontend

Open another terminal and run the following commands:

```bash
cd repoinsight-ai/frontend
npm install
npm run dev
```

The Next.js frontend will boot on `http://localhost:3000`.

### 4. Open the App
Go to [http://localhost:3000](http://localhost:3000) and paste a Github repo URL!

## Performance Rules Enforced

- `node_modules`, `dist`, `build`, and `.git` objects are naturally ignored during structure scanning.
- We restrict git cloning strictly to `--depth 1` to optimize cloning size.
- API answers are locally cached against the RepoURL so a single repository will invoke parsing purely once per session run.
