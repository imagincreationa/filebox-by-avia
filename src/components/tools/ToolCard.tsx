import { cn } from '@/lib/utils';
import { Tool } from '@/types/tools';
import { ArrowRight, Lock } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

const colorClasses = {
  yellow: {
    bg: 'from-retro-yellow-light to-retro-yellow/30',
    border: 'border-primary/20',
    icon: 'from-primary to-primary/80',
  },
  coral: {
    bg: 'from-retro-coral-light to-retro-coral/30',
    border: 'border-accent/20',
    icon: 'from-accent to-accent/80',
  },
  mint: {
    bg: 'from-retro-mint to-retro-mint/30',
    border: 'border-retro-mint',
    icon: 'from-retro-mint to-emerald-400',
  },
  lavender: {
    bg: 'from-retro-lavender to-retro-lavender/30',
    border: 'border-retro-lavender',
    icon: 'from-retro-lavender to-purple-400',
  },
  peach: {
    bg: 'from-retro-peach to-retro-peach/30',
    border: 'border-retro-peach',
    icon: 'from-retro-peach to-orange-400',
  },
};

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const colors = colorClasses[tool.color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300",
        "bg-gradient-to-br hover:-translate-y-1 hover:shadow-hover",
        colors.bg,
        colors.border
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4 shadow-soft",
          "group-hover:scale-110 transition-transform duration-300",
          colors.icon
        )}
      >
        {tool.icon}
      </div>

      {/* Content */}
      <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {tool.description}
      </p>

      {/* Arrow indicator */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-primary" />
      </div>

      {/* File limit badge */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/50 text-xs font-semibold text-muted-foreground">
          Up to {tool.maxFiles} files
        </span>
        {tool.requiresApi && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            <Lock className="w-3 h-3" />
            API Required
          </span>
        )}
      </div>
    </button>
  );
}
