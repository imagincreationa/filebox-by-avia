export type ToolCategory = 'pdf' | 'image' | 'document';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  color: 'yellow' | 'coral' | 'mint' | 'lavender' | 'peach';
  maxFiles: number;
  acceptedFormats: string[];
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface ProcessingSettings {
  quality?: 'high' | 'medium' | 'low';
  format?: string;
  dpi?: number;
  orientation?: 'portrait' | 'landscape';
  margin?: 'none' | 'small' | 'medium' | 'large';
  pageRange?: string;
  backgroundColor?: string;
}
