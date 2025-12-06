import { useState } from 'react';
import { X, Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tool, UploadedFile, ProcessingSettings } from '@/types/tools';
import { Button } from '@/components/ui/button';
import { FileUploadZone } from './FileUploadZone';

interface ToolModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>({
    quality: 'high',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-float border-2 border-border animate-bounce-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border bg-gradient-to-r from-muted/50 to-transparent">
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
        <div className="p-6">
          {!isComplete ? (
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

                  {/* Quality selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                      Quality
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['high', 'medium', 'low'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => setSettings({ ...settings, quality: q })}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                            settings.quality === q
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {q.charAt(0).toUpperCase() + q.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info card */}
                <div className="p-4 rounded-2xl bg-retro-yellow-light/50 border-2 border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Pro tip!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher quality means larger file sizes. Choose based on your needs.
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
        {!isComplete && (
          <div className="p-6 border-t-2 border-border bg-muted/30">
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
                    Process Files
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
