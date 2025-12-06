import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Image, 
  FileType, 
  Home, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSettingsClick?: () => void;
  onUpgradeClick?: () => void;
}

const menuItems = [
  { id: 'all', label: 'All Tools', icon: Home },
  { id: 'pdf', label: 'PDF Tools', icon: FileText },
  { id: 'image', label: 'Image Tools', icon: Image },
  { id: 'document', label: 'Document', icon: FileType },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
];

export function Sidebar({ activeCategory, onCategoryChange, onSettingsClick, onUpgradeClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r-2 border-sidebar-border z-40",
        "flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b-2 border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl shadow-soft">
            ✨
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-foreground">FileBox</span>
              <span className="text-xs text-muted-foreground font-medium">Digital Tools</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-card border-2 border-border shadow-soft z-50"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </Button>

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pl-3">
            Categories
          </p>
        )}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onCategoryChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200",
              activeCategory === item.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Pro upgrade card */}
      {!collapsed && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-retro-yellow-light to-retro-peach border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-bold text-foreground">Go Pro!</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock unlimited conversions & premium features
          </p>
          <Button variant="retro" size="sm" className="w-full" onClick={onUpgradeClick}>
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="p-4 border-t-2 border-sidebar-border space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'settings' && onSettingsClick) {
                onSettingsClick();
              }
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
