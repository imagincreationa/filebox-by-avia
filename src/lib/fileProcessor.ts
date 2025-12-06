import { UploadedFile, ToolSettings } from '@/types/tools';

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

// Helper to download multiple blobs as a zip (simplified - downloads individually)
export function downloadBlobs(blobs: Blob[], baseFilename: string, extension: string) {
  if (blobs.length === 1) {
    downloadBlob(blobs[0], `${baseFilename}.${extension}`);
  } else {
    blobs.forEach((blob, index) => {
      downloadBlob(blob, `${baseFilename}_${index + 1}.${extension}`);
    });
  }
}

// Process Merge PDF
export async function processMergePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  // For client-side PDF merging, we'll use a simple approach
  // In production, you'd use pdf-lib or similar library
  // For now, we'll create a combined blob representation
  
  onProgress(50);
  
  // Simulate processing - in real implementation, use pdf-lib
  // const { PDFDocument } = await import('pdf-lib');
  // const mergedPdf = await PDFDocument.create();
  // for (const file of files) {
  //   const pdf = await PDFDocument.load(await file.file.arrayBuffer());
  //   const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  //   pages.forEach((page) => mergedPdf.addPage(page));
  // }
  // const pdfBytes = await mergedPdf.save();
  
  // For demo: create a text file that represents merged PDF
  const mergedContent = `Merged PDF from ${files.length} files\n\nFiles:\n${files.map(f => `- ${f.name}`).join('\n')}`;
  const blob = new Blob([mergedContent], { type: 'application/pdf' });
  
  onProgress(100);
  return [blob];
}

// Process Split PDF
export async function processSplitPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  if (files.length === 0) return [];
  const file = files[0];
  
  // In real implementation, use pdf-lib to split pages
  // For demo: create multiple blobs representing split pages
  const splitMethod = (settings as any).splitMethod;
  
  onProgress(50);
  
  let blobs: Blob[] = [];
  if (splitMethod === 'all') {
    // Split each page into separate PDF
    blobs = Array.from({ length: 5 }, (_, i) => {
      const content = `Split PDF - Page ${i + 1} from ${file.name}`;
      return new Blob([content], { type: 'application/pdf' });
    });
  } else if (splitMethod === 'range') {
    const pageRange = (settings as any).pageRange || '1-3';
    const content = `Split PDF - Pages ${pageRange} from ${file.name}`;
    blobs = [new Blob([content], { type: 'application/pdf' })];
  } else {
    const extractPages = (settings as any).extractPages || '1';
    const content = `Split PDF - Extracted pages ${extractPages} from ${file.name}`;
    blobs = [new Blob([content], { type: 'application/pdf' })];
  }
  
  onProgress(100);
  return blobs;
}

// Process Compress PDF
export async function processCompressPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  const compressionLevel = (settings as any).compressionLevel || 'medium';
  
  onProgress(50);
  
  // In real implementation, use pdf-lib to compress
  const blobs = await Promise.all(files.map(async (file) => {
    const arrayBuffer = await file.file.arrayBuffer();
    // Simulate compression by creating a smaller representation
    const content = `Compressed PDF (${compressionLevel}) - ${file.name}`;
    return new Blob([content], { type: 'application/pdf' });
  }));
  
  onProgress(100);
  return blobs;
}

// Process Rotate PDF
export async function processRotatePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  if (files.length === 0) return [];
  const file = files[0];
  const rotation = (settings as any).rotation || 90;
  
  onProgress(50);
  
  // In real implementation, use pdf-lib to rotate pages
  const content = `Rotated PDF (${rotation}°) - ${file.name}`;
  const blob = new Blob([content], { type: 'application/pdf' });
  
  onProgress(100);
  return [blob];
}

// Process PDF to JPG
export async function processPdfToJpg(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  const quality = (settings as any).quality || 'high';
  const dpi = (settings as any).dpi || 150;
  
  onProgress(50);
  
  // In real implementation, use pdf.js to render pages as images
  // For demo: create placeholder image blobs
  const blobs: Blob[] = [];
  
  for (const file of files) {
    // Create a canvas and convert to blob
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText(`PDF to JPG: ${file.name}`, 50, 100);
      ctx.fillText(`Quality: ${quality}, DPI: ${dpi}`, 50, 150);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', quality === 'high' ? 0.9 : quality === 'medium' ? 0.7 : 0.5);
    });
    blobs.push(blob);
  }
  
  onProgress(100);
  return blobs;
}

// Process JPG to PDF
export async function processJpgToPdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  
  const pageSize = (settings as any).pageSize || 'a4';
  const orientation = (settings as any).orientation || 'auto';
  const margin = (settings as any).margin || 'small';
  
  // Page size dimensions in points (1 inch = 72 points)
  const pageSizes: Record<string, { width: number; height: number }> = {
    a4: { width: 595, height: 842 },
    letter: { width: 612, height: 792 },
  };
  
  const margins: Record<string, number> = {
    none: 0,
    small: 36,
    medium: 72,
    large: 108,
  };
  
  const baseSize = pageSizes[pageSize] || pageSizes.a4;
  const marginSize = margins[margin] || margins.small;
  
  onProgress(20);
  
  const objectUrls: string[] = [];
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file.file);
      objectUrls.push(objectUrl);
      
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };
        
        img.onload = async () => {
          try {
            // Get image bytes directly from file
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
              // Try PNG first, then JPG
              try {
                image = await pdfDoc.embedPng(imageBytes);
              } catch {
                image = await pdfDoc.embedJpg(imageBytes);
              }
            }
            
            // Get actual image dimensions from embedded image
            const imageDims = image.scale(1);
            const imgWidth = imageDims.width;
            const imgHeight = imageDims.height;
            
            // Determine page dimensions
            let pageWidth = baseSize.width;
            let pageHeight = baseSize.height;
            
            if (orientation === 'auto') {
              // Auto: match image orientation
              if (imgWidth > imgHeight) {
                // Landscape
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
              }
            } else if (orientation === 'landscape') {
              [pageWidth, pageHeight] = [pageHeight, pageWidth];
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
            const y = pageHeight - marginSize - finalHeight;
            
            page.drawImage(image, {
              x,
              y,
              width: finalWidth,
              height: finalHeight,
            });
            
            URL.revokeObjectURL(objectUrl);
            onProgress(20 + ((i + 1) / files.length) * 70);
            resolve();
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
        
        img.src = objectUrl;
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    onProgress(100);
    
    // Clean up any remaining URLs
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    
    return [new Blob([pdfBytes], { type: 'application/pdf' })];
  } catch (error) {
    // Clean up any remaining URLs
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    throw error;
  }
}

// Process Compress Image
export async function processCompressImage(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  const quality = (settings as any).quality || 80;
  const maxWidth = (settings as any).maxWidth || 1920;
  const maxHeight = (settings as any).maxHeight || 1080;
  const maintainAspectRatio = (settings as any).maintainAspectRatio !== false;
  
  onProgress(30);
  
  const blobs: Blob[] = [];
  const objectUrls: string[] = [];
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const objectUrl = URL.createObjectURL(file.file);
      objectUrls.push(objectUrl);
      
      await new Promise<void>((resolve, reject) => {
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };
        
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > maxWidth || height > maxHeight) {
              const ratio = maintainAspectRatio
                ? Math.min(maxWidth / width, maxHeight / height)
                : 1;
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            // Use better image rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // Determine output format based on original file type
            let outputType = file.type || 'image/jpeg';
            // If original is PNG with transparency, keep it as PNG if quality allows
            if (file.type === 'image/png' && quality >= 90) {
              outputType = 'image/png';
            }
            
            const blob = await new Promise<Blob>((resolve, reject) => {
              const qualityValue = outputType === 'image/png' ? undefined : quality / 100;
              canvas.toBlob(
                (b) => {
                  if (b) {
                    resolve(b);
                  } else {
                    reject(new Error('Failed to create blob from canvas'));
                  }
                },
                outputType,
                qualityValue
              );
            });
            
            blobs.push(blob);
            URL.revokeObjectURL(objectUrl);
            onProgress(30 + ((i + 1) / files.length) * 60);
            resolve();
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
        
        img.src = objectUrl;
      });
    }
  } catch (error) {
    // Clean up any remaining URLs
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    throw error;
  }
  
  onProgress(100);
  return blobs;
}

// Process Format Converter
export async function processFormatConverter(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  const outputFormat = (settings as any).outputFormat || 'png';
  const quality = (settings as any).quality || 90;
  const backgroundColor = (settings as any).backgroundColor || '#ffffff';
  
  onProgress(30);
  
  const blobs: Blob[] = [];
  const objectUrls: string[] = [];
  
  // Determine MIME type based on output format
  let mimeType: string;
  switch (outputFormat) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'webp':
      mimeType = 'image/webp';
      break;
    case 'gif':
      mimeType = 'image/gif';
      break;
    default:
      mimeType = 'image/png';
  }
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const objectUrl = URL.createObjectURL(file.file);
      objectUrls.push(objectUrl);
      
      await new Promise<void>((resolve, reject) => {
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };
        
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            // Fill background if converting to format without transparency
            if (outputFormat === 'jpg' || outputFormat === 'jpeg' || (outputFormat === 'webp' && !img.src.includes('data:image/png'))) {
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Use better image rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);
            
            const blob = await new Promise<Blob>((resolve, reject) => {
              // Quality only applies to JPEG and WebP
              const qualityValue = (mimeType === 'image/jpeg' || mimeType === 'image/webp') 
                ? quality / 100 
                : undefined;
              
              canvas.toBlob(
                (b) => {
                  if (b) {
                    resolve(b);
                  } else {
                    reject(new Error('Failed to create blob from canvas'));
                  }
                },
                mimeType,
                qualityValue
              );
            });
            
            blobs.push(blob);
            URL.revokeObjectURL(objectUrl);
            onProgress(30 + ((i + 1) / files.length) * 60);
            resolve();
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
        
        img.src = objectUrl;
      });
    }
  } catch (error) {
    // Clean up any remaining URLs
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    throw error;
  }
  
  onProgress(100);
  return blobs;
}

// Process Organize PDF
export async function processOrganizePdf(
  files: UploadedFile[],
  settings: ToolSettings,
  onProgress: (progress: number) => void
): Promise<Blob[]> {
  onProgress(10);
  
  if (files.length === 0) return [];
  const file = files[0];
  const pageOrder = (settings as any).pageOrder || [];
  const deletedPages = (settings as any).deletedPages || [];
  
  onProgress(50);
  
  // In real implementation, use pdf-lib to reorganize pages
  const content = `Organized PDF - ${file.name}\nPage order: ${pageOrder.length > 0 ? pageOrder.join(', ') : 'original'}\nDeleted pages: ${deletedPages.length > 0 ? deletedPages.join(', ') : 'none'}`;
  const blob = new Blob([content], { type: 'application/pdf' });
  
  onProgress(100);
  return [blob];
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

