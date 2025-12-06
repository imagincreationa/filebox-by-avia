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
  requiresApi?: boolean;
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
  result?: Blob | Blob[];
}

// Tool-specific settings types
export interface MergePdfSettings {
  outputFilename: string;
}

export interface SplitPdfSettings {
  splitMethod: 'all' | 'range' | 'extract';
  pageRange: string; // e.g., "1-3, 5, 7-9"
  extractPages: string; // e.g., "1, 3, 5"
}

export interface RotatePdfSettings {
  rotation: 90 | 180 | 270;
  applyTo: 'all' | 'selected';
  selectedPages: string;
}

export interface OrganizePdfSettings {
  pageOrder: number[];
  deletedPages: number[];
}

export interface PdfToJpgSettings {
  quality: 'high' | 'medium' | 'low';
  dpi: 72 | 150 | 300;
}

export interface JpgToPdfSettings {
  pageSize: 'a4' | 'letter' | 'original';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: 'none' | 'small' | 'medium' | 'large';
  imageQuality: 'high' | 'medium' | 'low';
}

export interface CompressImageSettings {
  quality: number; // 0-100
  maxWidth: number;
  maxHeight: number;
  maintainAspectRatio: boolean;
}

export interface FormatConverterSettings {
  outputFormat: 'jpg' | 'png' | 'webp' | 'gif';
  quality: number; // 0-100
  backgroundColor: string;
}

export interface CompressPdfSettings {
  compressionLevel: 'low' | 'medium' | 'high';
}

export type ToolSettings = 
  | MergePdfSettings
  | SplitPdfSettings
  | RotatePdfSettings
  | OrganizePdfSettings
  | PdfToJpgSettings
  | JpgToPdfSettings
  | CompressImageSettings
  | FormatConverterSettings
  | CompressPdfSettings;

// Default settings for each tool
export const defaultSettings: Record<string, ToolSettings> = {
  'merge-pdf': {
    outputFilename: 'merged',
  } as MergePdfSettings,
  'split-pdf': {
    splitMethod: 'all',
    pageRange: '',
    extractPages: '',
  } as SplitPdfSettings,
  'rotate-pdf': {
    rotation: 90,
    applyTo: 'all',
    selectedPages: '',
  } as RotatePdfSettings,
  'organize-pdf': {
    pageOrder: [],
    deletedPages: [],
  } as OrganizePdfSettings,
  'pdf-to-jpg': {
    quality: 'high',
    dpi: 150,
  } as PdfToJpgSettings,
  'jpg-to-pdf': {
    pageSize: 'a4',
    orientation: 'auto',
    margin: 'small',
    imageQuality: 'high',
  } as JpgToPdfSettings,
  'compress-image': {
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    maintainAspectRatio: true,
  } as CompressImageSettings,
  'format-converter': {
    outputFormat: 'png',
    quality: 90,
    backgroundColor: '#ffffff',
  } as FormatConverterSettings,
  'compress-pdf': {
    compressionLevel: 'medium',
  } as CompressPdfSettings,
};
