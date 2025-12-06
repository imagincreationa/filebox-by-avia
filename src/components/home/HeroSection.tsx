import { Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dotted-pattern opacity-30" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-retro-mint/30 to-retro-lavender/30 rounded-full blur-3xl" />

      <div className="relative">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">All-in-One File Toolkit</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Your Friendly{' '}
            <span className="relative">
              <span className="relative z-10 text-primary">Digital Toolbox</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 -rotate-1 rounded" />
            </span>
            {' '}for Everyday Tasks
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Convert, compress, merge, and organize your files with our retro-styled, 
            super-friendly tools. No signup needed – just drag, drop, and done! ✨
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="retro" size="xl">
              Get Started Free
            </Button>
            <Button variant="outline" size="xl">
              See All Tools
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border-2 border-border shadow-soft">
              <div className="w-8 h-8 rounded-lg bg-retro-mint/50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border-2 border-border shadow-soft">
              <div className="w-8 h-8 rounded-lg bg-retro-lavender/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border-2 border-border shadow-soft">
              <div className="w-8 h-8 rounded-lg bg-retro-peach/50 flex items-center justify-center">
                <span className="text-sm">🎨</span>
              </div>
              <span className="font-semibold text-sm text-foreground">Retro & Fun</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
