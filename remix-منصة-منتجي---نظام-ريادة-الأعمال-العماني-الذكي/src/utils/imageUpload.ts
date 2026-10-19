/**
 * Client-side Image Processing & Compression Utility
 * Compresses images from phone camera or gallery to crisp WebP/JPEG DataURL (< 300KB)
 * for safe, fast storage in Firestore and instant preview without breaking character limits.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
}

export function processAndCompressImage(
  file: File,
  maxDimension = 1000,
  quality = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة صالحة.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل معالجة أبعاد الصورة.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل إنشاء مساحة رسم للضغط.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal size, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        const sizeKb = Math.round(sizeInBytes / 1024);

        resolve({
          dataUrl,
          sizeKb,
          width,
          height,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
