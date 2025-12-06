import { CompressPdfSettings as Settings } from '@/types/tools';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function CompressPdfSettings({ settings, onChange }: Props) {
  const levels = [
    { value: 'low', label: 'Low', desc: 'Best quality, larger file (~20% reduction)' },
    { value: 'medium', label: 'Medium', desc: 'Balanced quality & size (~50% reduction)' },
    { value: 'high', label: 'High', desc: 'Smallest file, lower quality (~70% reduction)' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Compression Level
        </Label>
        <div className="space-y-2">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ ...settings, compressionLevel: level.value })}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all border-2",
                settings.compressionLevel === level.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{level.label}</p>
              <p className="text-xs text-muted-foreground">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
