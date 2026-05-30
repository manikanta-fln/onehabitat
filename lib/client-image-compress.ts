const DEFAULT_MAX_BYTES = 1.5 * 1024 * 1024;
const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.82;

type CompressOptions = {
  maxBytes?: number;
  maxDimension?: number;
  quality?: number;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image for compression"));
    };
    image.src = url;
  });
}

function scaledDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longest;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

async function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

function toUploadFile(blob: Blob, originalName: string): File {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "upload";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

/**
 * Resize and re-encode photos before upload so they stay under common proxy limits.
 * Returns the original file when compression is unnecessary or unsupported.
 */
export async function compressImageForUpload(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options.quality ?? DEFAULT_QUALITY;

  if (file.size <= maxBytes) {
    return file;
  }

  try {
    const image = await loadImageFromFile(file);
    const { width, height } = scaledDimensions(
      image.naturalWidth,
      image.naturalHeight,
      maxDimension
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    let currentQuality = quality;
    let blob = await canvasToJpegBlob(canvas, currentQuality);
    let compressed = toUploadFile(blob, file.name);

    while (compressed.size > maxBytes && currentQuality > 0.45) {
      currentQuality -= 0.08;
      blob = await canvasToJpegBlob(canvas, currentQuality);
      compressed = toUploadFile(blob, file.name);
    }

    if (compressed.size >= file.size) {
      return file;
    }

    return compressed;
  } catch {
    if (file.size > maxBytes) {
      throw new Error(
        "Image is too large. Please choose a photo under 5MB or retake it at a lower resolution."
      );
    }
    return file;
  }
}
