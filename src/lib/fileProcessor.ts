import { PDFDocument, degrees } from 'pdf-lib';
import { UploadedFile, ToolSettings } from '@/types/tools';

// Helper to create a PDF Blob from pdf-lib Uint8Array (fixes TypeScript compatibility)
function createPdfBlob(pdfBytes: Uint8Array): Blob {
  // Create a new ArrayBuffer and copy the data to ensure compatibility
  const buffer = new ArrayBuffer(pdfBytes.length);
  const view = new Uint8Array(buffer);
  view.set(pdfBytes);
  return new Blob([buffer], { type: 'application/pdf' });
}

// Helper to download a blob as a file
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to download multiple blobs
export function downloadBlobs(blobs: Blob[], baseFilename: string, extension: string) {
  if (blobs.length === 1) {
    downloadBlob(blobs[0], `${baseFilename}.${extension}`);
  } else {
    blobs.forEach((blob, index) => {
      downloadBlob(blob, `${baseFilename}_${index + 1}.${extension}`);
    });
  }
}

// Process Merge PDF - REAL IMPLEMENTATION
export async function processMergePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const mergedPdf = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.file.arrayBuffer();
    
    try {
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw new Error(`Failed to process ${file.name}. Make sure it's a valid PDF.`);
    }
    
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  const pdfBytes = await mergedPdf.save();
  onProgress(100);
  
  return [createPdfBlob(pdfBytes)];
}

// Process Split PDF - REAL IMPLEMENTATION
export async function processSplitPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const file = files[0];
  const arrayBuffer = await file.file.arrayBuffer();
  
  let sourcePdf: PDFDocument;
  try {
    sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (error) {
    throw new Error(`Failed to load PDF. Make sure it's a valid PDF file.`);
  }
  
  const totalPages = sourcePdf.getPageCount();
  const splitSettings = settings as any;
  const splitMethod = splitSettings.splitMethod || 'all';
  
  const blobs: Blob[] = [];
  
  if (splitMethod === 'all') {
    // Split each page into separate PDF
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(sourcePdf, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      blobs.push(createPdfBlob(pdfBytes));
      onProgress(10 + ((i + 1) / totalPages) * 80);
    }
  } else if (splitMethod === 'range') {
    // Parse page range like "1-3, 5, 7-9"
    const pageRange = splitSettings.pageRange || '1';
    const pageIndices = parsePageRange(pageRange, totalPages);
    
    const newPdf = await PDFDocument.create();
    for (const pageIndex of pageIndices) {
      const [page] = await newPdf.copyPages(sourcePdf, [pageIndex]);
      newPdf.addPage(page);
    }
    const pdfBytes = await newPdf.save();
    blobs.push(createPdfBlob(pdfBytes));
  } else if (splitMethod === 'extract') {
    // Extract specific pages
    const extractPages = splitSettings.extractPages || '1';
    const pageIndices = parsePageRange(extractPages, totalPages);
    
    for (let i = 0; i < pageIndices.length; i++) {
      const pageIndex = pageIndices[i];
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(sourcePdf, [pageIndex]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      blobs.push(createPdfBlob(pdfBytes));
      onProgress(10 + ((i + 1) / pageIndices.length) * 80);
    }
  }
  
  onProgress(100);
  return blobs;
}

// Helper to parse page ranges like "1-3, 5, 7-9"
function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(',').map(s => s.trim()).filter(s => s);
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(s => parseInt(s.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(end, maxPages); i++) {
          pages.add(i - 1); // Convert to 0-indexed
        }
      }
    } else {
      const pageNum = parseInt(part);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum - 1); // Convert to 0-indexed
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

// Process Compress PDF - REAL IMPLEMENTATION
export async function processCompressPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const blobs: Blob[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.file.arrayBuffer();
    
    try {
      // Load and re-save the PDF - this removes unused objects
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Save with compression options
      const pdfBytes = await pdf.save({
        useObjectStreams: true, // Use object streams for better compression
        addDefaultPage: false,
      });
      
      blobs.push(createPdfBlob(pdfBytes));
    } catch (error) {
      console.error(`Error compressing ${file.name}:`, error);
      throw new Error(`Failed to compress ${file.name}. Make sure it's a valid PDF.`);
    }
    
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  onProgress(100);
  return blobs;
}

// Process Rotate PDF - REAL IMPLEMENTATION
export async function processRotatePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const file = files[0];
  const arrayBuffer = await file.file.arrayBuffer();
  const rotateSettings = settings as any;
  const rotation = rotateSettings.rotation || 90;
  const applyTo = rotateSettings.applyTo || 'all';
  
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (error) {
    throw new Error(`Failed to load PDF. Make sure it's a valid PDF file.`);
  }
  
  const pages = pdf.getPages();
  const totalPages = pages.length;
  
  if (applyTo === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
      onProgress(10 + ((i + 1) / totalPages) * 80);
    }
  } else {
    // Apply to selected pages only
    const selectedPages = rotateSettings.selectedPages || '';
    const pageIndices = parsePageRange(selectedPages, totalPages);
    
    for (let i = 0; i < pageIndices.length; i++) {
      const pageIndex = pageIndices[i];
      if (pageIndex < totalPages) {
        const page = pages[pageIndex];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }
      onProgress(10 + ((i + 1) / pageIndices.length) * 80);
    }
  }
  
  const pdfBytes = await pdf.save();
  onProgress(100);
  
  return [createPdfBlob(pdfBytes)];
}

// Process PDF to JPG - Canvas-based conversion
export async function processPdfToJpg(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const pdfSettings = settings as any;
  const quality = pdfSettings.quality || 'high';
  const dpi = pdfSettings.dpi || 150;
  
  // Quality to JPEG quality mapping
  const qualityMap: Record<string, number> = {
    high: 0.92,
    medium: 0.75,
    low: 0.5,
  };
  
  // DPI to scale factor (72 DPI is baseline)
  const scale = dpi / 72;
  
  const blobs: Blob[] = [];
  
  // We need to use pdf.js for proper rendering, but for now we'll create a placeholder
  // In a real implementation, you'd use pdf.js library
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Create a canvas with the PDF info
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(612 * scale); // Letter width at specified DPI
    canvas.height = Math.round(792 * scale); // Letter height at specified DPI
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Info text
      ctx.fillStyle = '#333333';
      ctx.font = `${24 * scale}px Arial`;
      ctx.fillText(`PDF: ${file.name}`, 50 * scale, 100 * scale);
      ctx.font = `${16 * scale}px Arial`;
      ctx.fillText(`Quality: ${quality}, DPI: ${dpi}`, 50 * scale, 140 * scale);
      ctx.fillText('Full PDF rendering requires pdf.js integration', 50 * scale, 180 * scale);
    }
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => b ? resolve(b) : reject(new Error('Failed to create image')),
        'image/jpeg',
        qualityMap[quality]
      );
    });
    
    blobs.push(blob);
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  onProgress(100);
  return blobs;
}

// Process JPG to PDF - REAL IMPLEMENTATION
export async function processJpgToPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const pdfDoc = await PDFDocument.create();
  const jpgSettings = settings as any;
  
  const pageSize = jpgSettings.pageSize || 'a4';
  const orientation = jpgSettings.orientation || 'auto';
  const margin = jpgSettings.margin || 'small';
  
  // Page size dimensions in points (1 inch = 72 points)
  const pageSizes: Record<string, { width: number; height: number }> = {
    a4: { width: 595, height: 842 },
    letter: { width: 612, height: 792 },
    original: { width: 0, height: 0 }, // Will be set based on image
  };
  
  const margins: Record<string, number> = {
    none: 0,
    small: 36,
    medium: 72,
    large: 108,
  };
  
  const marginSize = margins[margin] || margins.small;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const imageBytes = new Uint8Array(arrayBuffer);
      
      // Embed image based on file type
      let image;
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      if (fileType === 'image/png' || fileName.endsWith('.png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (fileType === 'image/jpeg' || fileType === 'image/jpg' || 
                 fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        // Try to detect format
        try {
          image = await pdfDoc.embedJpg(imageBytes);
        } catch {
          image = await pdfDoc.embedPng(imageBytes);
        }
      }
      
      const imageDims = image.scale(1);
      const imgWidth = imageDims.width;
      const imgHeight = imageDims.height;
      
      // Determine page dimensions
      let pageWidth: number;
      let pageHeight: number;
      
      if (pageSize === 'original') {
        pageWidth = imgWidth + (marginSize * 2);
        pageHeight = imgHeight + (marginSize * 2);
      } else {
        const baseSize = pageSizes[pageSize] || pageSizes.a4;
        pageWidth = baseSize.width;
        pageHeight = baseSize.height;
        
        if (orientation === 'auto') {
          if (imgWidth > imgHeight) {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
        } else if (orientation === 'landscape') {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
      }
      
      // Calculate image dimensions to fit on page with margins
      const maxWidth = pageWidth - (marginSize * 2);
      const maxHeight = pageHeight - (marginSize * 2);
      
      const aspectRatio = imgWidth / imgHeight;
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      // Scale to fit if needed
      if (finalWidth > maxWidth || finalHeight > maxHeight) {
        if (maxWidth / aspectRatio <= maxHeight) {
          finalWidth = maxWidth;
          finalHeight = maxWidth / aspectRatio;
        } else {
          finalHeight = maxHeight;
          finalWidth = maxHeight * aspectRatio;
        }
      }
      
      // Add page
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      // Center image on page
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;
      
      page.drawImage(image, {
        x,
        y,
        width: finalWidth,
        height: finalHeight,
      });
      
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error);
      throw new Error(`Failed to process ${file.name}. Make sure it's a valid image.`);
    }
    
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  const pdfBytes = await pdfDoc.save();
  onProgress(100);
  
  return [createPdfBlob(pdfBytes)];
}

// Process Compress Image - Canvas-based compression
export async function processCompressImage(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const imgSettings = settings as any;
  const quality = imgSettings.quality || 80;
  const maxWidth = imgSettings.maxWidth || 1920;
  const maxHeight = imgSettings.maxHeight || 1080;
  const maintainAspectRatio = imgSettings.maintainAspectRatio !== false;
  
  const blobs: Blob[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const blob = await compressImageFile(file.file, {
      quality: quality / 100,
      maxWidth,
      maxHeight,
      maintainAspectRatio,
    });
    
    blobs.push(blob);
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  onProgress(100);
  return blobs;
}

// Helper function to compress a single image
async function compressImageFile(
  file: File,
  options: { quality: number; maxWidth: number; maxHeight: number; maintainAspectRatio: boolean }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (options.maintainAspectRatio) {
          if (width > options.maxWidth || height > options.maxHeight) {
            const ratio = Math.min(options.maxWidth / width, options.maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
        } else {
          width = Math.min(width, options.maxWidth);
          height = Math.min(height, options.maxHeight);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determine output format
        let outputType = file.type || 'image/jpeg';
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(outputType)) {
          outputType = 'image/jpeg';
        }
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create compressed image'));
            }
          },
          outputType,
          outputType === 'image/png' ? undefined : options.quality
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };
    
    img.src = objectUrl;
  });
}

// Process Format Converter - Canvas-based conversion
export async function processFormatConverter(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const convSettings = settings as any;
  const outputFormat = convSettings.outputFormat || 'png';
  const quality = convSettings.quality || 90;
  const backgroundColor = convSettings.backgroundColor || '#ffffff';
  
  // Determine MIME type
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  
  const mimeType = mimeTypes[outputFormat] || 'image/png';
  
  const blobs: Blob[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const blob = await convertImageFormat(file.file, {
      mimeType,
      quality: quality / 100,
      backgroundColor,
    });
    
    blobs.push(blob);
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  
  onProgress(100);
  return blobs;
}

// Helper function to convert image format
async function convertImageFormat(
  file: File,
  options: { mimeType: string; quality: number; backgroundColor: string }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        // Fill background for formats that don't support transparency
        if (options.mimeType === 'image/jpeg') {
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);
        
        // Quality only applies to JPEG and WebP
        const qualityValue = (options.mimeType === 'image/jpeg' || options.mimeType === 'image/webp')
          ? options.quality
          : undefined;
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          options.mimeType,
          qualityValue
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };
    
    img.src = objectUrl;
  });
}

// Process Organize PDF - REAL IMPLEMENTATION
export async function processOrganizePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  if (files.length === 0) return [];
  
  onProgress(10);
  
  const file = files[0];
  const arrayBuffer = await file.file.arrayBuffer();
  const orgSettings = settings as any;
  const pageOrder = orgSettings.pageOrder || [];
  const deletedPages = new Set(orgSettings.deletedPages || []);
  
  let sourcePdf: PDFDocument;
  try {
    sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (error) {
    throw new Error(`Failed to load PDF. Make sure it's a valid PDF file.`);
  }
  
  const totalPages = sourcePdf.getPageCount();
  const newPdf = await PDFDocument.create();
  
  // If no order specified, use default order minus deleted pages
  let finalOrder = pageOrder.length > 0 ? pageOrder : Array.from({ length: totalPages }, (_, i) => i);
  
  // Filter out deleted pages
  finalOrder = finalOrder.filter((pageIndex: number) => !deletedPages.has(pageIndex));
  
  onProgress(30);
  
  for (let i = 0; i < finalOrder.length; i++) {
    const pageIndex = finalOrder[i];
    if (pageIndex >= 0 && pageIndex < totalPages) {
      const [page] = await newPdf.copyPages(sourcePdf, [pageIndex]);
      newPdf.addPage(page);
    }
    onProgress(30 + ((i + 1) / finalOrder.length) * 60);
  }
  
  const pdfBytes = await newPdf.save();
  onProgress(100);
  
  return [createPdfBlob(pdfBytes)];
}

// Main processor function
export async function processFiles(
  toolId: string,
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  switch (toolId) {
    case 'merge-pdf':
      return processMergePdf(files, settings, onProgress);
    case 'split-pdf':
      return processSplitPdf(files, settings, onProgress);
    case 'compress-pdf':
      return processCompressPdf(files, settings, onProgress);
    case 'rotate-pdf':
      return processRotatePdf(files, settings, onProgress);
    case 'organize-pdf':
      return processOrganizePdf(files, settings, onProgress);
    case 'pdf-to-jpg':
      return processPdfToJpg(files, settings, onProgress);
    case 'jpg-to-pdf':
      return processJpgToPdf(files, settings, onProgress);
    case 'compress-image':
      return processCompressImage(files, settings, onProgress);
    case 'format-converter':
      return processFormatConverter(files, settings, onProgress);
    default:
      throw new Error(`Unknown tool: ${toolId}`);
  }
}
