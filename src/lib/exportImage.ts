import renderWatermark from "./renderWatermark";
import type { ExportFormat } from "../types/export";
import type { WatermarkSettings } from "../types/watermark";

type ExportOptions = {
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  extension: "png" | "jpg" | "webp";
};

function getExportOptions(file: File, format: ExportFormat): ExportOptions {
  if (format === "png") return { mimeType: "image/png", extension: "png" };
  if (format === "jpeg") return { mimeType: "image/jpeg", extension: "jpg" };

  if (file.type === "image/jpeg") {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }

  if (file.type === "image/webp") {
    return { mimeType: "image/webp", extension: "webp" };
  }

  return { mimeType: "image/png", extension: "png" };
}

function canvasToBlob(canvas: HTMLCanvasElement, options: ExportOptions) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not create exported image"));
      }
    }, options.mimeType, options.mimeType === "image/png" ? undefined : 0.92);
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getExportFileName(fileName: string, extension: ExportOptions["extension"]) {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExtension}-watermarked.${extension}`;
}

async function exportImage(
  file: File,
  settings: WatermarkSettings,
  format: ExportFormat,
  watermarkFile: File | null,
) {
  const image = await createImageBitmap(file);
  const watermarkImage =
    settings.type === "image" && watermarkFile
      ? await createImageBitmap(watermarkFile)
      : undefined;

  try {
    const canvas = document.createElement("canvas");
    renderWatermark({
      canvas,
      image,
      watermarkImage,
      originalDimensions: { width: image.width, height: image.height },
      settings,
    });

    const options = getExportOptions(file, format);
    downloadBlob(
      await canvasToBlob(canvas, options),
      getExportFileName(file.name, options.extension),
    );
  } finally {
    image.close();
    watermarkImage?.close();
  }
}

export default exportImage;
