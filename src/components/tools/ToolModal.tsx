import { useState, useEffect } from 'react';
import { X, Download, Loader2, Check, AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tool, UploadedFile, ToolSettings, defaultSettings } from '@/types/tools';
import { Button } from '@/components/ui/button';
import { FileUploadZone } from './FileUploadZone';
import { ToolSettingsPanel } from './ToolSettingsPanel';

interface ToolModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState<ToolSettings>(
    () => defaultSettings[tool.id] ?? defaultSettings['merge-pdf']
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlobs, setResultBlobs] = useState<Blob[]>([]);

  // Reset settings when tool changes
  useEffect(() => {
    setSettings(defaultSettings[tool.id] ?? defaultSettings['merge-pdf']);
    setFiles([]);
    setIsComplete(false);
    setProgress(0);
    setResultBlobs([]);
  }, [tool.id]);

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing for now - will be replaced with actual processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownload = () => {
    // In a real app, this would download the processed file
    alert('Download would start here! (Demo mode)');
  };

  const handleReset = () => {
    setFiles([]);
    setIsComplete(false);
    setProgress(0);
    setResultBlobs([]);
  };

  if (!isOpen) return null;

  const isApiRequired = tool.requiresApi;

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl shadow-soft">
              {tool.icon}
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isApiRequired ? (
            /* API Required State */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Lock className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-2">
                API Configuration Required
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This feature requires CloudConvert API integration. The API key needs to be configured to enable this tool.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : !isComplete ? (
            <div className="grid md:grid-cols-5 gap-6">
              {/* Upload zone */}
              <div className="md:col-span-3">
                <FileUploadZone
                  acceptedFormats={tool.acceptedFormats}
                  maxFiles={tool.maxFiles}
                  files={files}
                  onFilesChange={setFiles}
                />
              </div>

              {/* Settings panel */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl bg-muted/50 border-2 border-border">
                  <h4 className="font-bold text-foreground mb-4">Settings</h4>
                  <ToolSettingsPanel
                    toolId={tool.id}
                    settings={settings}
                    onChange={setSettings}
                  />
                </div>

                {/* Tool-specific tip */}
                <div className="p-4 rounded-2xl bg-retro-yellow-light/50 border-2 border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {getToolTip(tool.id).title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getToolTip(tool.id).description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success state */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-retro-mint to-emerald-400 flex items-center justify-center">
                <Check className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-2">
                Processing Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your files are ready to download
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="coral" size="lg" onClick={handleDownload}>
                  <Download className="w-5 h-5 mr-2" />
                  Download Files
                </Button>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  Process More
                </Button>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">
                  Processing...
                </span>
                <span className="text-sm font-semibold text-primary">
                  {progress}%
                </span>
              </div>
              <div className="retro-progress">
                <div
                  className="retro-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isComplete && !isApiRequired && (
          <div className="p-6 border-t-2 border-border bg-muted/30 shrink-0">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="retro"
                size="lg"
                onClick={handleProcess}
                disabled={files.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {getProcessButtonText(tool.id)}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getToolTip(toolId: string): { title: string; description: string } {
  const tips: Record<string, { title: string; description: string }> = {
    'merge-pdf': {
      title: 'Drag to reorder!',
      description: 'You can drag files in the list to change their order in the merged PDF.',
    },
    'split-pdf': {
      title: 'Page ranges',
      description: 'Use commas to separate ranges (1-3, 5-7) or individual pages (1, 3, 5).',
    },
    'rotate-pdf': {
      title: 'Clockwise rotation',
      description: 'Pages are rotated clockwise. Use 270° for counter-clockwise.',
    },
    'organize-pdf': {
      title: 'Drag & drop pages',
      description: 'After uploading, you can drag pages to reorder or click to delete.',
    },
    'pdf-to-jpg': {
      title: 'Higher DPI = larger files',
      description: 'Use 72 DPI for web, 150 for standard, 300 for print quality.',
    },
    'jpg-to-pdf': {
      title: 'Image order matters',
      description: 'Images will appear in the PDF in the order they are listed.',
    },
    'compress-image': {
      title: 'Quality vs size',
      description: 'Lower quality = smaller file. 80% is usually a good balance.',
    },
    'format-converter': {
      title: 'Format tips',
      description: 'JPG for photos, PNG for graphics with transparency, WebP for web.',
    },
    'compress-pdf': {
      title: 'Basic compression',
      description: 'Removes duplicate resources and optimizes structure. For heavy compression, use API tools.',
    },
  };

  return tips[toolId] || { title: 'Pro tip!', description: 'Process your files with the settings above.' };
}

function getProcessButtonText(toolId: string): string {
  const texts: Record<string, string> = {
    'merge-pdf': 'Merge PDFs',
    'split-pdf': 'Split PDF',
    'rotate-pdf': 'Rotate Pages',
    'organize-pdf': 'Save Changes',
    'pdf-to-jpg': 'Convert to JPG',
    'jpg-to-pdf': 'Create PDF',
    'compress-image': 'Compress Images',
    'format-converter': 'Convert Images',
    'compress-pdf': 'Compress PDF',
  };

  return texts[toolId] || 'Process Files';
}
