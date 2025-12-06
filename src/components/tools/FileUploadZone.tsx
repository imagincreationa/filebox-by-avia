import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { UploadedFile } from '@/types/tools';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  acceptedFormats: string[];
  maxFiles: number;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export function FileUploadZone({
  acceptedFormats,
  maxFiles,
  files,
  onFilesChange,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedFormats.includes(ext);
    });

    const remainingSlots = maxFiles - files.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const uploadedFiles: UploadedFile[] = filesToAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const,
      progress: 0,
    }));

    onFilesChange([...files, ...uploadedFiles]);
  }, [files, maxFiles, acceptedFormats, onFilesChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "upload-zone p-8 text-center",
          isDragOver && "drag-over"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary" />
        </div>

        <h4 className="font-bold text-lg text-foreground mb-2">
          Drop your files here
        </h4>
        <p className="text-muted-foreground text-sm mb-4">
          or click to browse from your computer
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {acceptedFormats.map((format) => (
            <span
              key={format}
              className="px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase"
            >
              {format}
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Up to {maxFiles} {maxFiles === 1 ? 'file' : 'files'}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                </div>
                {file.status === 'processing' ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
