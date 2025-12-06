import { Tool } from '@/types/tools';
import { ToolCard } from './ToolCard';

interface ToolsGridProps {
  tools: Tool[];
  onToolSelect: (tool: Tool) => void;
}

export function ToolsGrid({ tools, onToolSelect }: ToolsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {tools.map((tool, index) => (
        <div
          key={tool.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ToolCard tool={tool} onClick={() => onToolSelect(tool)} />
        </div>
      ))}
    </div>
  );
}
