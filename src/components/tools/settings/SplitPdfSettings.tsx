import { SplitPdfSettings as Settings } from '@/types/tools';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SplitPdfSettings({ settings, onChange }: Props) {
  const methods = [
    { value: 'all', label: 'All Pages', desc: 'Split into individual pages' },
    { value: 'range', label: 'By Range', desc: 'e.g., 1-3, 5-7' },
    { value: 'extract', label: 'Extract', desc: 'Extract specific pages' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Split Method
        </Label>
        <div className="space-y-2">
          {methods.map((method) => (
            <button
              key={method.value}
              onClick={() => onChange({ ...settings, splitMethod: method.value })}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all border-2",
                settings.splitMethod === method.value
                  ? "bg-primary/10 border-primary"
                  : "bg-muted border-transparent hover:bg-muted/80"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{method.label}</p>
              <p className="text-xs text-muted-foreground">{method.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {settings.splitMethod === 'range' && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground">
            Page Ranges
          </Label>
          <Input
            value={settings.pageRange}
            onChange={(e) => onChange({ ...settings, pageRange: e.target.value })}
            placeholder="1-3, 5-7, 10-12"
            className="bg-background"
          />
        </div>
      )}

      {settings.splitMethod === 'extract' && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground">
            Pages to Extract
          </Label>
          <Input
            value={settings.extractPages}
            onChange={(e) => onChange({ ...settings, extractPages: e.target.value })}
            placeholder="1, 3, 5, 8"
            className="bg-background"
          />
        </div>
      )}
    </div>
  );
}
