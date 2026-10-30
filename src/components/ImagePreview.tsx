import { useLayoutEffect, useRef, useState } from "react";
import useWatermarkCanvas from "../hooks/useWatermarkCanvas";
import type { PreviewAsset } from "../types/image";
import type { WatermarkSettings } from "../types/watermark";

type ImagePreviewProps = {
  preview: PreviewAsset | undefined;
  watermarkImage: ImageBitmap | undefined;
  settings: WatermarkSettings;
  showMarginGuide: boolean;
};

function ImagePreview({
  preview,
  watermarkImage,
  settings,
  showMarginGuide,
}: ImagePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasBounds, setCanvasBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const preview = previewRef.current;
    const canvas = canvasRef.current;
    if (!preview || !canvas) return;

    const updateCanvasBounds = () => {
      const previewBounds = preview.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      setCanvasBounds({
        left: canvasRect.left - previewBounds.left,
        top: canvasRect.top - previewBounds.top,
        width: canvasRect.width,
        height: canvasRect.height,
      });
    };

    const observer = new ResizeObserver(updateCanvasBounds);
    observer.observe(preview);
    observer.observe(canvas);
    updateCanvasBounds();

    return () => observer.disconnect();
  }, [preview]);

  useWatermarkCanvas({
    canvasRef,
    preview,
    watermarkImage,
    settings,
  });

  return (
    <div
      ref={previewRef}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6"
    >
      <canvas
        ref={canvasRef}
        className="block max-h-full max-w-full object-contain"
      />
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${showMarginGuide ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <div
          className="absolute"
          style={{
            left: canvasBounds.left,
            top: canvasBounds.top,
            width: canvasBounds.width,
            height: canvasBounds.height,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 bg-black/45"
            style={{ height: `${settings.margin}%` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 bg-black/45"
            style={{ height: `${settings.margin}%` }}
          />
          <div
            className="absolute left-0 bg-black/45"
            style={{
              top: `${settings.margin}%`,
              bottom: `${settings.margin}%`,
              width: `${settings.margin}%`,
            }}
          />
          <div
            className="absolute right-0 bg-black/45"
            style={{
              top: `${settings.margin}%`,
              bottom: `${settings.margin}%`,
              width: `${settings.margin}%`,
            }}
          />
          <div
            className="absolute border border-dashed border-white/80"
            style={{
              left: `${settings.margin}%`,
              right: `${settings.margin}%`,
              top: `${settings.margin}%`,
              bottom: `${settings.margin}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;
