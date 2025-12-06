import { useState } from 'react';
import { X, User, Crown, Check, Sparkles, Zap, Shield, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [userPlan] = useState<'free' | 'pro'>('free');

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsUpgrading(true);
    // Simulate upgrade process
    setTimeout(() => {
      setIsUpgrading(false);
      // In real app, this would redirect to payment or show success
      alert('Upgrade successful! Welcome to Pro!');
      onClose();
    }, 1500);
  };

  const features = [
    { icon: Infinity, text: 'Unlimited file conversions' },
    { icon: Zap, text: 'Faster processing speeds' },
    { icon: Shield, text: 'Priority support' },
    { icon: Sparkles, text: 'Advanced features' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-float border-2 border-border animate-bounce-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border bg-gradient-to-r from-muted/50 to-transparent shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border-2 border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">Guest User</h3>
                <p className="text-sm text-muted-foreground">guest@filebox.app</p>
                <div className="mt-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    userPlan === 'pro'
                      ? "bg-gradient-to-r from-retro-yellow-light to-retro-peach text-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {userPlan === 'pro' ? 'Pro Member' : 'Free Plan'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          {userPlan === 'free' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Upgrade to Pro</h3>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-retro-yellow-light/50 to-retro-peach/50 border-2 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-xl text-foreground mb-1">Pro Plan</h4>
                    <p className="text-sm text-muted-foreground">Unlock all features</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">$9.99</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="retro"
                  size="lg"
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Pro
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Pro Features (if already pro) */}
          {userPlan === 'pro' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-retro-yellow-light/50 to-retro-peach/50 border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">Pro Benefits</h3>
                </div>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Stats */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">Usage Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border-2 border-border">
                <p className="text-sm text-muted-foreground mb-1">Files Processed</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border-2 border-border">
                <p className="text-sm text-muted-foreground mb-1">Storage Used</p>
                <p className="text-2xl font-bold text-foreground">0 MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-border bg-muted/30 shrink-0">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

