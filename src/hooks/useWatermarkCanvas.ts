import { useEffect, type RefObject } from "react";
import renderWatermark from "../lib/renderWatermark";
import type { PreviewAsset } from "../types/image";
import type { WatermarkSettings } from "../types/watermark";

type UseWatermarkCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  preview: PreviewAsset | undefined;
  watermarkImage: ImageBitmap | undefined;
  settings: WatermarkSettings;
};

function useWatermarkCanvas({
  canvasRef,
  preview,
  watermarkImage,
  settings,
}: UseWatermarkCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!preview) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    renderWatermark({
      canvas,
      image: preview.bitmap,
      watermarkImage,
      originalDimensions: preview.originalDimensions,
      settings,
    });
  }, [canvasRef, preview, settings, watermarkImage]);
}

export default useWatermarkCanvas;
