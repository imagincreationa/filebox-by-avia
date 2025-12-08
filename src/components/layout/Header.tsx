import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSearch } from '@/hooks/useSearch';
import { Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onProfileClick?: () => void;
  onToolSelect?: (tool: Tool) => void;
}

export function Header({ onProfileClick, onToolSelect }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { searchQuery, searchResults, isSearchOpen, setIsSearchOpen, handleSearch, clearSearch } = useSearch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchOpen]);

  const handleToolClick = (tool: Tool) => {
    if (onToolSelect) {
      onToolSelect(tool);
    }
    clearSearch();
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const getUserAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture;
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b-2 border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search bar */}
        <div className="flex-1 max-w-md" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setIsSearchOpen(true)}
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-muted border-2 border-transparent 
                         focus:border-primary focus:bg-card focus:outline-none transition-all
                         font-medium text-foreground placeholder:text-muted-foreground"
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-float overflow-hidden z-50">
                {searchResults.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    {tool.requiresApi && (
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        API
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {isSearchOpen && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-float p-4 z-50">
                <p className="text-muted-foreground text-center">No tools found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>
          
          <div className="w-px h-8 bg-border" />
          
          {user ? (
            /* Logged in user */
            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                className="gap-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {getUserAvatar() ? (
                  <img 
                    src={getUserAvatar()} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <span className="font-semibold hidden sm:inline max-w-[120px] truncate">
                  {getUserDisplayName()}
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showUserMenu && "rotate-180"
                )} />
              </Button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border-2 border-border shadow-float overflow-hidden z-50">
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 hover:bg-destructive/10 transition-colors text-left text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in */
            <Button 
              variant="retro" 
              onClick={() => navigate('/auth')}
              className="font-semibold"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
