import renderWatermark from "./renderWatermark";
import type { WatermarkSettings } from "../types/watermark";

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not create exported image"));
      }
    }, "image/png");
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

function getExportFileName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExtension}-watermarked.png`;
}

async function exportImage(file: File, settings: WatermarkSettings) {
  const image = await createImageBitmap(file);

  try {
    const canvas = document.createElement("canvas");
    renderWatermark({
      canvas,
      image,
      originalDimensions: { width: image.width, height: image.height },
      settings,
    });

    downloadBlob(await canvasToBlob(canvas), getExportFileName(file.name));
  } finally {
    image.close();
  }
}

export default exportImage;
