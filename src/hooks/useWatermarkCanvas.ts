import { useEffect, type RefObject } from "react";

type UseWatermarkCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  file: File | undefined;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  watermarkColor: string;
  position: string;
  margin: number;
};

function useWatermarkCanvas({
  canvasRef,
  file,
  watermarkText,
  fontSize,
  opacity,
  watermarkColor,
  position,
  margin,
}: UseWatermarkCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!file || !canvas) return;

    let isCurrent = true;
    let image: ImageBitmap | undefined;

    const draw = async () => {
      try {
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
      } catch (error) {
        if (isCurrent) {
          console.error("Failed to render image watermark:", error);
        }
      }
    };

    void draw();

    return () => {
      isCurrent = false;
      image?.close();
    };
  }, [
    canvasRef,
    file,
    watermarkText,
    fontSize,
    opacity,
    watermarkColor,
    position,
    margin,
  ]);
}

export default useWatermarkCanvas;
