import { useState } from 'react';
import { X, Save, Bell, Moon, Sun, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'en',
    autoSave: true,
    compressionQuality: 'medium',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('filebox-settings', JSON.stringify(settings));
    onClose();
  };

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
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your preferences</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Notifications</h3>
            </div>
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-foreground">
                  Enable notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-foreground">
                  Email notifications
                </Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Appearance</h3>
            </div>
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-foreground">
                  Dark mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, darkMode: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* General */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">General</h3>
            </div>
            <div className="space-y-3 pl-8">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground">
                  Language
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    setSettings({ ...settings, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save" className="text-foreground">
                  Auto-save progress
                </Label>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSave: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Processing</h3>
            </div>
            <div className="space-y-3 pl-8">
              <div className="space-y-2">
                <Label htmlFor="compression-quality" className="text-foreground">
                  Default compression quality
                </Label>
                <Select
                  value={settings.compressionQuality}
                  onValueChange={(value) =>
                    setSettings({ ...settings, compressionQuality: value })
                  }
                >
                  <SelectTrigger id="compression-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (faster, larger files)</SelectItem>
                    <SelectItem value="medium">Medium (balanced)</SelectItem>
                    <SelectItem value="high">High (slower, smaller files)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-border bg-muted/30 shrink-0">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="retro" size="lg" onClick={handleSave}>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

