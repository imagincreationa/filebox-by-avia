import { Tool } from '@/types/tools';

export const tools: Tool[] = [
  // PDF Tools
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one file',
    icon: '📎',
    category: 'pdf',
    color: 'yellow',
    maxFiles: 10,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split PDF into multiple files by page range',
    icon: '✂️',
    category: 'pdf',
    color: 'coral',
    maxFiles: 1,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while keeping quality',
    icon: '🗜️',
    category: 'pdf',
    color: 'mint',
    maxFiles: 10,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages in any direction',
    icon: '🔄',
    category: 'pdf',
    color: 'lavender',
    maxFiles: 1,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    description: 'Reorder, delete, or add pages to PDF',
    icon: '📑',
    category: 'pdf',
    color: 'peach',
    maxFiles: 1,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    description: 'Convert to archival PDF/A format',
    icon: '🏛️',
    category: 'pdf',
    color: 'yellow',
    maxFiles: 10,
    acceptedFormats: ['.pdf'],
    requiresApi: true,
  },
  // Document Conversion
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert DOC/DOCX to PDF format',
    icon: '📝',
    category: 'document',
    color: 'coral',
    maxFiles: 10,
    acceptedFormats: ['.doc', '.docx'],
    requiresApi: true,
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images',
    icon: '🖼️',
    category: 'document',
    color: 'mint',
    maxFiles: 10,
    acceptedFormats: ['.pdf'],
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert images to PDF document',
    icon: '📄',
    category: 'document',
    color: 'lavender',
    maxFiles: 30,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  // Image Tools
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Reduce image size while preserving quality',
    icon: '📸',
    category: 'image',
    color: 'peach',
    maxFiles: 30,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },
  {
    id: 'format-converter',
    name: 'Format Converter',
    description: 'Convert images between any format',
    icon: '🔀',
    category: 'image',
    color: 'yellow',
    maxFiles: 30,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.bmp'],
  },
];

export const getToolsByCategory = (category: string) => {
  return tools.filter(tool => tool.category === category);
};

export const getToolById = (id: string) => {
  return tools.find(tool => tool.id === id);
};
