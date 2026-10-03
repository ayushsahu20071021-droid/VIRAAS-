// Client-side photo editing for AI Try-On privacy.
//
// The user can (a) crop off the top of the photo (e.g. to remove their head) and/or
// (b) cover the face region with an opaque bar. When either edit is applied we send the
// EDITED image to the server — never the untouched original.

export interface PhotoEdit {
  hideFace: boolean;
  /** Percentage of the image height to crop off the TOP (0–45). */
  cropTopPct: number;
}

export const DEFAULT_EDIT: PhotoEdit = { hideFace: false, cropTopPct: 0 };

export function isEdited(e: PhotoEdit): boolean {
  return e.hideFace || e.cropTopPct > 0;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read the photo.'));
    img.src = src;
  });
}

/** Apply the edit to a data-URL and return a new JPEG data-URL. */
export async function processPhoto(src: string, edit: PhotoEdit): Promise<string> {
  if (!isEdited(edit)) return src;
  const img = await loadImage(src);
  const cropPct = Math.max(0, Math.min(45, edit.cropTopPct));
  const sy = Math.round((img.naturalHeight * cropPct) / 100);
  const sh = img.naturalHeight - sy;
  const w = img.naturalWidth;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return src;
  ctx.drawImage(img, 0, sy, w, sh, 0, 0, w, sh);

  if (edit.hideFace) {
    // Cover the top ~26% of the (already-cropped) image — where a face sits in a
    // full / three-quarter body photo.
    const barH = Math.round(sh * 0.26);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, barH);
  }
  return canvas.toDataURL('image/jpeg', 0.9);
}

/** Approx byte size of a base64 data-URL. */
export function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(',');
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  return Math.floor((b64.length * 3) / 4);
}

/** Trigger a client-side download of a data-URL (keeps the result private to the device). */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Share an image data-URL via the Web Share API (files) with no public URL. */
export async function shareImage(dataUrl: string, filename: string, text: string): Promise<'shared' | 'unsupported' | 'cancelled'> {
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void>; canShare?: (d: ShareData) => boolean };
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
    if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
      await nav.share({ files: [file], title: 'VIRAAS', text });
      return 'shared';
    }
    return 'unsupported';
  } catch (e) {
    return (e as Error).name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}
