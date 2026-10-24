import { useEffect, useState, type RefObject } from "react";
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
  maxDimension: number;
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
  maxDimension,
}: UseWatermarkCanvasProps) {
  const [image, setImage] = useState<ImageBitmap | null>(null);

  useEffect(() => {
    if (!file) {
      setImage(null);
      return;
    }

    let isCurrent = true;
    let bitmap: ImageBitmap | null = null;

    const loadImage = async () => {
      try {
        bitmap = await createImageBitmap(file);
        if (!isCurrent) {
          bitmap.close();
          return;
        }
        setImage(bitmap);
      } catch (error) {
        if (isCurrent) {
          console.error("Failed to load image:", error);
          setImage(null);
        }
      }
    };

    void loadImage();

    return () => {
      isCurrent = false;
      bitmap?.close();
    };
  }, [file]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    renderWatermark({
      canvas,
      image,
      watermarkText,
      fontSize,
      opacity,
      watermarkColor,
      position,
      margin,
      maxDimension,
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
