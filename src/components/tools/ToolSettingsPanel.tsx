import { ToolSettings } from '@/types/tools';
import {
  MergePdfSettings,
  SplitPdfSettings,
  RotatePdfSettings,
  PdfToJpgSettings,
  JpgToPdfSettings,
  CompressImageSettings,
  FormatConverterSettings,
  CompressPdfSettings,
} from './settings';

interface Props {
  toolId: string;
  settings: ToolSettings;
  onChange: (settings: ToolSettings) => void;
}

export function ToolSettingsPanel({ toolId, settings, onChange }: Props) {
  switch (toolId) {
    case 'merge-pdf':
      return (
        <MergePdfSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'split-pdf':
      return (
        <SplitPdfSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'rotate-pdf':
      return (
        <RotatePdfSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'pdf-to-jpg':
      return (
        <PdfToJpgSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'jpg-to-pdf':
      return (
        <JpgToPdfSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'compress-image':
      return (
        <CompressImageSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'format-converter':
      return (
        <FormatConverterSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'compress-pdf':
      return (
        <CompressPdfSettings
          settings={settings as any}
          onChange={onChange}
        />
      );
    case 'organize-pdf':
      return (
        <div className="text-sm text-muted-foreground">
          <p>Upload a PDF to see page thumbnails and organize them.</p>
        </div>
      );
    default:
      return (
        <div className="text-sm text-muted-foreground">
          <p>No settings available for this tool.</p>
        </div>
      );
  }
}
