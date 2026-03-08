export const generateMermaidDiagram = (dependencyGraph: Record<string, string[]>) => {
  const entries = Object.entries(dependencyGraph).filter(([, deps]) => deps.length > 0);
  
  // If no dependencies found, return empty string
  if (entries.length === 0) {
    return '';
  }

  let diagram = 'graph TD\n';
  
  // Map file paths to unique safe node IDs
  const nodeIds = new Map<string, string>();
  let counter = 0;
  
  const getNodeId = (filePath: string): string => {
    if (nodeIds.has(filePath)) {
      return nodeIds.get(filePath)!;
    }
    const id = `N${counter++}`;
    nodeIds.set(filePath, id);
    return id;
  };

  const getLabel = (filePath: string): string => {
    // Use just the filename for a clean label
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1] || filePath;
    // Remove anything that could break Mermaid syntax
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  };
  
  // To avoid massive diagrams, take only first 50 files with dependencies
  let limit = 50;
  
  for (const [file, deps] of entries) {
    if (limit-- <= 0) break;
    
    const srcId = getNodeId(file);
    const srcLabel = getLabel(file);
    
    for (const dep of deps) {
      const depId = getNodeId(dep);
      const depLabel = getLabel(dep);
      diagram += `  ${srcId}[${srcLabel}] --> ${depId}[${depLabel}]\n`;
    }
  }

  return diagram;
};
