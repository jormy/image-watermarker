import { useEffect, type RefObject } from "react";
import renderWatermark from "../lib/renderWatermark";

type UseWatermarkCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  image: ImageBitmap | undefined;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  watermarkColor: string;
  position: string;
  margin: number;
};

function useWatermarkCanvas({
  canvasRef,
  image,
  watermarkText,
  fontSize,
  opacity,
  watermarkColor,
  position,
  margin,
}: UseWatermarkCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!image) {
      const context = canvas.getContext("2d");
      if (context) {
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
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
  }, [
    canvasRef,
    image,
    watermarkText,
    fontSize,
    opacity,
    watermarkColor,
    position,
    margin,
  ]);
}

export default useWatermarkCanvas;
