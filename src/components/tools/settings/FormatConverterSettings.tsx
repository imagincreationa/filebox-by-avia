import { FormatConverterSettings as Settings } from '@/types/tools';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function FormatConverterSettings({ settings, onChange }: Props) {
  const formats = [
    { value: 'jpg', label: 'JPG', desc: 'Best for photos' },
    { value: 'png', label: 'PNG', desc: 'Lossless, transparency' },
    { value: 'webp', label: 'WebP', desc: 'Modern, small size' },
    { value: 'gif', label: 'GIF', desc: 'Simple animations' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Output Format
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => onChange({ ...settings, outputFormat: fmt.value })}
              className={cn(
                "p-3 rounded-lg text-left transition-all border-2",
                settings.outputFormat === fmt.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <p className="font-bold text-sm text-foreground">{fmt.label}</p>
              <p className="text-xs text-muted-foreground">{fmt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {settings.outputFormat !== 'png' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-muted-foreground">
              Quality
            </Label>
            <span className="text-sm font-bold text-primary">{settings.quality}%</span>
          </div>
          <Slider
            value={[settings.quality]}
            onValueChange={([value]) => onChange({ ...settings, quality: value })}
            min={10}
            max={100}
            step={5}
            className="py-2"
          />
        </div>
      )}

      {(settings.outputFormat === 'jpg' || settings.outputFormat === 'gif') && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground">
            Background Color
          </Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="bg-background flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Used when converting from transparent images
          </p>
        </div>
      )}
    </div>
  );
}
