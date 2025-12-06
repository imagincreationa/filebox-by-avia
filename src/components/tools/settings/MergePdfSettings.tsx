import { MergePdfSettings as Settings } from '@/types/tools';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function MergePdfSettings({ settings, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-muted-foreground">
          Output Filename
        </Label>
        <Input
          value={settings.outputFilename}
          onChange={(e) => onChange({ ...settings, outputFilename: e.target.value })}
          placeholder="merged"
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">.pdf will be added automatically</p>
      </div>
    </div>
  );
}
