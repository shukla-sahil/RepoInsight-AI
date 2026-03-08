import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

export const cloneRepository = async (repoUrl: string, destPath: string) => {
  const git = simpleGit();
  
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  try {
    // Clone with depth 1, disable credential helpers to avoid auth failures on public repos
    await git
      .env('GIT_TERMINAL_PROMPT', '0')
      .clone(repoUrl, destPath, [
        '--depth', '1',
        '-c', 'credential.helper=',
      ]);
  } catch (error) {
    console.error('[Clone] Git clone failed:', error instanceof Error ? error.message : error);
    throw new Error(`Failed to clone repository. Make sure the URL is a valid public GitHub repo: ${repoUrl}`);
  }
};

export const cleanupRepository = async (destPath: string) => {
  if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true, force: true });
  }
};
