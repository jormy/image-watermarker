import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ImagePreviewProps = {
  file: File | undefined;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  watermarkColor: string;
  position: string;
  margin: number;
  showMarginGuide: boolean;
};

function ImagePreview({
  file,
  watermarkText,
  fontSize,
  opacity,
  watermarkColor,
  position,
  margin,
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
  }, [file]);

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    const canvas = canvasRef.current;
    let image: ImageBitmap | undefined;
    let isCurrent = true;
    const draw = async () => {
      image = await createImageBitmap(file);
      if (!isCurrent) {
        image.close();
        return;
      }
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      const marginPx = image.width * (margin / 100);
      context.font = `bold ${fontSize}px sans-serif`;
      context.fillStyle = watermarkColor;
      context.globalAlpha = opacity / 100;
      context.textAlign = position.endsWith("right")
        ? "right"
        : position.endsWith("center") || position === "center"
          ? "center"
          : "left";
      context.textBaseline = position.startsWith("bottom")
        ? "bottom"
        : position.startsWith("center-") || position === "center"
          ? "middle"
          : "top";
      const x = position.endsWith("right")
        ? image.width - marginPx
        : context.textAlign === "center"
          ? image.width / 2
          : marginPx;
      const y = position.startsWith("bottom")
        ? image.height - marginPx
        : context.textBaseline === "middle"
          ? image.height / 2
          : marginPx;
      context.fillText(watermarkText, x, y);
      context.globalAlpha = 1;
    };
    draw();
    return () => {
      isCurrent = false;
      image?.close();
    };
  }, [
    file,
    watermarkText,
    fontSize,
    opacity,
    watermarkColor,
    position,
    margin,
  ]);

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
          <div className="absolute inset-x-0 top-0 bg-black/45" style={{ height: `${margin}%` }} />
          <div className="absolute inset-x-0 bottom-0 bg-black/45" style={{ height: `${margin}%` }} />
          <div
            className="absolute left-0 bg-black/45"
            style={{ top: `${margin}%`, bottom: `${margin}%`, width: `${margin}%` }}
          />
          <div
            className="absolute right-0 bg-black/45"
            style={{ top: `${margin}%`, bottom: `${margin}%`, width: `${margin}%` }}
          />
          <div
            className="absolute border border-dashed border-white/80"
            style={{
              left: `${margin}%`,
              right: `${margin}%`,
              top: `${margin}%`,
              bottom: `${margin}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;
