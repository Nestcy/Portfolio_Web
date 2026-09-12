/**
 * Image processing utilities for client-side image uploads,
 * thumbnail generation, and storage optimization.
 */

export interface ImageProcessingResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image (PNG, JPG, WEBP, GIF, SVG)' };
  }
  // 30MB limit before compression
  if (file.size > 30 * 1024 * 1024) {
    return { valid: false, error: 'Image file size exceeds 30MB' };
  }
  return { valid: true };
};

export const processImageFile = (
  file: File,
  maxDimension = 1400,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error || 'Invalid image'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (event) => {
      const rawResult = event.target?.result as string;

      // For SVGs or GIFs where animation is preserved, return raw dataUrl directly
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        return resolve(rawResult);
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Resize down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(rawResult);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // If original was PNG with potential transparency, use image/png, otherwise jpeg for optimal compression
          const isPng = file.type === 'image/png';
          const format = isPng ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(format, quality);

          // If compressed is smaller, use compressed, else use raw
          resolve(compressed.length < rawResult.length ? compressed : rawResult);
        } catch {
          resolve(rawResult);
        }
      };

      img.onerror = () => resolve(rawResult);
      img.src = rawResult;
    };

    reader.readAsDataURL(file);
  });
};

export const PROJECT_IMAGE_PRESETS = [
  {
    name: 'Marketing Agent UI (Native)',
    url: '/src/assets/images/marketing_agent_ui_1787498725335.jpg',
    category: 'Multi-Agent'
  },
  {
    name: 'Neural Network & Agent Pipeline',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'Infra'
  },
  {
    name: 'Data Architecture & Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    category: 'Analytics'
  },
  {
    name: 'High-Performance Computing',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Systems'
  },
  {
    name: 'Vector Search & Graph Topology',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'RAG'
  }
];
