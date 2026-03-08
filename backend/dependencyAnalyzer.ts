import madge from 'madge';
import path from 'path';

export const generateDependencyGraph = async (repoPath: string) => {
  try {
    const res = await madge(repoPath, {
      excludeRegExp: [/^\.git\//, /^node_modules\//, /dist\//, /build\//],
    });
    return res.obj();
  } catch (error) {
    console.error('Error generating dependency graph', error);
    return {};
  }
};
