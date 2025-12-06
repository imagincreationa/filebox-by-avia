import { RotatePdfSettings as Settings } from '@/types/tools';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function RotatePdfSettings({ settings, onChange }: Props) {
  const rotations = [
    { value: 90, label: '90°', icon: '↻' },
    { value: 180, label: '180°', icon: '↺↻' },
    { value: 270, label: '270°', icon: '↺' },
  ] as const;

  const applyOptions = [
    { value: 'all', label: 'All Pages' },
    { value: 'selected', label: 'Selected Pages' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Rotation Angle
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {rotations.map((rot) => (
            <button
              key={rot.value}
              onClick={() => onChange({ ...settings, rotation: rot.value })}
              className={cn(
                "p-3 rounded-lg text-center transition-all border-2 flex flex-col items-center gap-1",
                settings.rotation === rot.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <RotateCw 
                className={cn(
                  "w-5 h-5",
                  rot.value === 90 && "rotate-90",
                  rot.value === 180 && "rotate-180",
                  rot.value === 270 && "-rotate-90"
                )}
              />
              <span className="font-semibold text-sm text-foreground">{rot.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Apply To
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {applyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...settings, applyTo: opt.value })}
              className={cn(
                "p-2 rounded-lg text-sm font-semibold transition-all",
                settings.applyTo === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {settings.applyTo === 'selected' && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground">
            Page Numbers
          </Label>
          <Input
            value={settings.selectedPages}
            onChange={(e) => onChange({ ...settings, selectedPages: e.target.value })}
            placeholder="1, 3, 5-7"
            className="bg-background"
          />
        </div>
      )}
    </div>
  );
}
