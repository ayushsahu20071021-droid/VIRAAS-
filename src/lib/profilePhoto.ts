// Client-side preparation for the VIRAAS Connect profile-photo upload.
// The selected image is sent to the authenticated server endpoint as a bounded data URL;
// oversized photos are re-encoded locally so the request stays below the serverless JSON
// body cap. The server independently re-validates MIME type and size.
export const PROFILE_PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';
export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024; // server-enforced maximum (5 MB)

// Decoded-byte budget for the upload request. Base64 expansion (~4/3) plus the JSON
// envelope stays below the 4 MB serverless body limit used by the rest of VIRAAS.
const WIRE_BUDGET_BYTES = 2_750_000;
const MAX_DIMENSION = 1280;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function isAllowedProfilePhotoType(type: string): boolean {
  return ALLOWED_TYPES.has(type);
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the photo.'));
    reader.readAsDataURL(file);
  });
}

// Returns a data URL that is safe to send to the authenticated upload endpoint.
export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!isAllowedProfilePhotoType(file.type)) throw new Error('Profile photo must be a JPEG, PNG or WebP image.');
  if (file.size > PROFILE_PHOTO_MAX_BYTES) throw new Error('Profile photo must be at most 5 MB.');
  if (file.size <= WIRE_BUDGET_BYTES) return fileToDataUrl(file);

  // Re-encode large photos to a bounded JPEG so the upload fits the serverless body cap.
  const source = await fileToDataUrl(file);
  const image = await loadImage(source);
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  if (!sourceWidth || !sourceHeight) throw new Error('Could not safely process the photo.');
  const scale = Math.min(1, MAX_DIMENSION / sourceWidth, MAX_DIMENSION / sourceHeight);
  let width = Math.max(1, Math.round(sourceWidth * scale));
  let height = Math.max(1, Math.round(sourceHeight * scale));
  let quality = 0.85;
  for (let attempt = 0; attempt < 14; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not safely process the photo.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const result = canvas.toDataURL('image/jpeg', quality);
    if (!/^data:image\/jpeg;base64,/.test(result)) throw new Error('This browser could not safely encode the photo.');
    if (dataUrlBytes(result) <= WIRE_BUDGET_BYTES) return result;
    if (quality > 0.6) {
      quality = Math.max(0.6, quality - 0.08);
      continue;
    }
    const shrink = Math.min(0.88, Math.sqrt(WIRE_BUDGET_BYTES / dataUrlBytes(result)) * 0.9);
    const nextWidth = Math.floor(width * shrink);
    const nextHeight = Math.floor(height * shrink);
    if (nextWidth < 480 || nextHeight < 480 || (nextWidth === width && nextHeight === height)) break;
    width = nextWidth;
    height = nextHeight;
    quality = 0.85;
  }
  throw new Error('This photo could not be safely compressed. Choose a smaller image.');
}
