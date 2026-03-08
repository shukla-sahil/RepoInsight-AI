import fs from 'fs';
import path from 'path';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export const scanRepository = (dirPath: string, rootDir: string = dirPath): FileNode[] => {
  const nodes: FileNode[] = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === 'dist' || file === 'build') {
      continue;
    }

    const fullPath = path.join(dirPath, file);
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      nodes.push({
        name: file,
        path: relativePath,
        type: 'directory',
        children: scanRepository(fullPath, rootDir),
      });
    } else {
      nodes.push({
        name: file,
        path: relativePath,
        type: 'file',
      });
    }
  }

  return nodes;
};
