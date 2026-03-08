import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

export const analyzeCode = (repoPath: string) => {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
  });

  project.addSourceFilesAtPaths(path.join(repoPath, '**/*.{ts,tsx,js,jsx}').replace(/\\/g, '/'));

  const files = project.getSourceFiles();

  const summary = {
    totalFiles: files.length,
    classes: [] as Record<string, unknown>[],
    functions: [] as Record<string, unknown>[],
    services: [] as Record<string, unknown>[],
    modules: [] as Record<string, unknown>[],
  };

  for (const file of files) {
    if (file.getFilePath().includes('node_modules')) continue;

    const classes = file.getClasses();
    for (const cls of classes) {
      const className = cls.getName();
      if (!className) continue;

      const decorators = cls.getDecorators().map(d => d.getName());
      const classInfo = {
        name: className,
        file: file.getBaseName(),
        decorators,
      };

      if (decorators.includes('Injectable') || className.toLowerCase().includes('service')) {
        summary.services.push(classInfo);
      } else if (decorators.includes('NgModule')) {
        summary.modules.push(classInfo);
      } else {
        summary.classes.push(classInfo);
      }
    }

    const functions = file.getFunctions();
    for (const func of functions) {
      const funcName = func.getName();
      if (funcName) {
        summary.functions.push({
          name: funcName,
          file: file.getBaseName(),
        });
      }
    }
  }

  return summary;
};
