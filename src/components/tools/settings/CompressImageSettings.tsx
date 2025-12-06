import { CompressImageSettings as Settings } from '@/types/tools';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function CompressImageSettings({ settings, onChange }: Props) {
  return (
    <div className="space-y-4">
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Max Width (px)
        </Label>
        <Input
          type="number"
          value={settings.maxWidth}
          onChange={(e) => onChange({ ...settings, maxWidth: parseInt(e.target.value) || 1920 })}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Max Height (px)
        </Label>
        <Input
          type="number"
          value={settings.maxHeight}
          onChange={(e) => onChange({ ...settings, maxHeight: parseInt(e.target.value) || 1080 })}
          className="bg-background"
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
        <Label className="text-sm font-semibold text-foreground cursor-pointer">
          Maintain Aspect Ratio
        </Label>
        <Switch
          checked={settings.maintainAspectRatio}
          onCheckedChange={(checked) => onChange({ ...settings, maintainAspectRatio: checked })}
        />
      </div>
    </div>
  );
}
