import { PdfToJpgSettings as Settings } from '@/types/tools';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function PdfToJpgSettings({ settings, onChange }: Props) {
  const qualities = [
    { value: 'high', label: 'High', desc: 'Best quality, larger files' },
    { value: 'medium', label: 'Medium', desc: 'Balanced quality & size' },
    { value: 'low', label: 'Low', desc: 'Smaller files, lower quality' },
  ] as const;

  const dpiOptions = [
    { value: 72, label: '72 DPI', desc: 'Web/Screen' },
    { value: 150, label: '150 DPI', desc: 'Standard' },
    { value: 300, label: '300 DPI', desc: 'Print Quality' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Image Quality
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {qualities.map((q) => (
            <button
              key={q.value}
              onClick={() => onChange({ ...settings, quality: q.value })}
              className={cn(
                "p-2 rounded-lg text-center transition-all border-2",
                settings.quality === q.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{q.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Resolution (DPI)
        </Label>
        <div className="space-y-2">
          {dpiOptions.map((dpi) => (
            <button
              key={dpi.value}
              onClick={() => onChange({ ...settings, dpi: dpi.value })}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all border-2",
                settings.dpi === dpi.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{dpi.label}</p>
              <p className="text-xs text-muted-foreground">{dpi.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
