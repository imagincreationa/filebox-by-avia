import { JpgToPdfSettings as Settings } from '@/types/tools';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function JpgToPdfSettings({ settings, onChange }: Props) {
  const pageSizes = [
    { value: 'a4', label: 'A4' },
    { value: 'letter', label: 'Letter' },
    { value: 'original', label: 'Original' },
  ] as const;

  const orientations = [
    { value: 'auto', label: 'Auto' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
  ] as const;

  const margins = [
    { value: 'none', label: 'None' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ] as const;

  const qualities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Page Size
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {pageSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => onChange({ ...settings, pageSize: size.value })}
              className={cn(
                "p-2 rounded-lg text-sm font-semibold transition-all",
                settings.pageSize === size.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Orientation
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {orientations.map((orient) => (
            <button
              key={orient.value}
              onClick={() => onChange({ ...settings, orientation: orient.value })}
              className={cn(
                "p-2 rounded-lg text-sm font-semibold transition-all",
                settings.orientation === orient.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {orient.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Margin
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {margins.map((margin) => (
            <button
              key={margin.value}
              onClick={() => onChange({ ...settings, margin: margin.value })}
              className={cn(
                "p-2 rounded-lg text-xs font-semibold transition-all",
                settings.margin === margin.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {margin.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Image Quality
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {qualities.map((q) => (
            <button
              key={q.value}
              onClick={() => onChange({ ...settings, imageQuality: q.value })}
              className={cn(
                "p-2 rounded-lg text-sm font-semibold transition-all",
                settings.imageQuality === q.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
