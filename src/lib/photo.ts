// Client-side photo editing and bounded re-encoding for private AI Try-On uploads.
// The selected image is never uploaded unchanged. Processing errors reject rather than falling
// back to raw photo bytes, so an enabled face-hide edit cannot silently be skipped.

export interface PhotoEdit {
  hideFace: boolean;
  /** Percentage of the image height to crop from the top (0–45). */
  cropTopPct: number;
}

export const DEFAULT_EDIT: PhotoEdit = { hideFace: false, cropTopPct: 0 };
// Decoded JPEG byte budget; base64 expansion plus the JSON envelope remains below Vercel's body cap.
export const MAX_TRYON_PHOTO_BYTES = 2_750_000;

export function isEdited(edit: PhotoEdit): boolean {
  return edit.hideFace || edit.cropTopPct > 0;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read the photo.'));
    image.src = src;
  });
}

export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const encoded = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.floor(encoded.length * 3 / 4);
}

export async function processPhoto(source: string, edit: PhotoEdit): Promise<string> {
  const image = await loadImage(source);
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  if (!sourceWidth || !sourceHeight) throw new Error('Could not safely process the photo.');

  const cropTopPct = Math.max(0, Math.min(45, edit.cropTopPct));
  const sourceY = Math.round(sourceHeight * cropTopPct / 100);
  const croppedHeight = sourceHeight - sourceY;
  const initialScale = Math.min(1, 1600 / sourceWidth, 2000 / croppedHeight);
  let width = Math.max(1, Math.round(sourceWidth * initialScale));
  let height = Math.max(1, Math.round(croppedHeight * initialScale));
  let quality = 0.84;

  for (let attempt = 0; attempt < 14; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not safely process the photo.');
    context.drawImage(image, 0, sourceY, sourceWidth, croppedHeight, 0, 0, width, height);
    if (edit.hideFace) {
      context.fillStyle = '#1a1a1a';
      context.fillRect(0, 0, width, Math.max(1, Math.round(height * 0.26)));
    }

    const result = canvas.toDataURL('image/jpeg', quality);
    if (!/^data:image\/jpeg;base64,/.test(result)) throw new Error('This browser could not safely encode the photo.');
    const bytes = dataUrlBytes(result);
    if (bytes <= MAX_TRYON_PHOTO_BYTES) return result;

    if (quality > 0.60) {
      quality = Math.max(0.60, quality - 0.08);
      continue;
    }
    const shrink = Math.min(0.88, Math.sqrt(MAX_TRYON_PHOTO_BYTES / bytes) * 0.9);
    const nextWidth = Math.floor(width * shrink);
    const nextHeight = Math.floor(height * shrink);
    if (nextWidth < 480 || nextHeight < 480 || (nextWidth === width && nextHeight === height)) break;
    width = nextWidth;
    height = nextHeight;
    quality = 0.84;
  }
  throw new Error('This photo could not be safely compressed. Choose a smaller image.');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function shareImage(dataUrl: string, filename: string, text: string): Promise<'shared' | 'unsupported' | 'cancelled'> {
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void>; canShare?: (data: ShareData) => boolean };
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
    if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
      await nav.share({ files: [file], title: 'VIRAAS', text });
      return 'shared';
    }
    return 'unsupported';
  } catch (error) {
    return (error as Error).name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}
