import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b-2 border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-muted border-2 border-transparent 
                         focus:border-primary focus:bg-card focus:outline-none transition-all
                         font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>
          
          <div className="w-px h-8 bg-border" />
          
          <Button variant="ghost" className="gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold hidden sm:inline">Guest User</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
