import { cn } from '@/lib/utils';
import { FileText, Image, FileType, LayoutGrid } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Tools', icon: LayoutGrid, count: 11 },
  { id: 'pdf', label: 'PDF Tools', icon: FileText, count: 6 },
  { id: 'image', label: 'Image Tools', icon: Image, count: 2 },
  { id: 'document', label: 'Document', icon: FileType, count: 3 },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-card border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          <category.icon className="w-4 h-4" />
          <span>{category.label}</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold",
              activeCategory === category.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
}
