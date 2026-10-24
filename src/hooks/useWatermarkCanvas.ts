import { useEffect, type RefObject } from "react";
import renderWatermark from "../lib/renderWatermark";

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
        renderWatermark({
          canvas,
          image,
          watermarkText,
          fontSize,
          opacity,
          watermarkColor,
          position,
          margin,
        });
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
