import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { ToolModal } from '@/components/tools/ToolModal';
import { tools, getToolsByCategory } from '@/data/tools';
import { Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : getToolsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <Header />
        
        <div className="p-6 lg:p-8">
          {/* Hero section */}
          <HeroSection />

          {/* Tools section */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {activeCategory === 'all' ? 'All Tools' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tools`}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Choose a tool to get started
                </p>
              </div>
            </div>

            <CategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            <ToolsGrid 
              tools={filteredTools} 
              onToolSelect={setSelectedTool} 
            />
          </section>

          {/* Footer */}
          <footer className="mt-16 py-8 border-t-2 border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg">
                  ✨
                </div>
                <div>
                  <span className="font-bold text-foreground">FileBox</span>
                  <span className="text-muted-foreground ml-2 text-sm">© 2024</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors font-medium">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors font-medium">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors font-medium">Help</a>
                <a href="#" className="hover:text-foreground transition-colors font-medium">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
};

export default Index;
