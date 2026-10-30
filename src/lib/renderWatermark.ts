import type { ImageDimensions } from "../types/image";
import type { WatermarkSettings } from "../types/watermark";

type RenderWatermarkOptions = {
  canvas: HTMLCanvasElement;
  image: ImageBitmap;
  watermarkImage?: ImageBitmap;
  originalDimensions: ImageDimensions;
  settings: WatermarkSettings;
};

function getAlignment(position: WatermarkSettings["position"]) {
  return {
    horizontal: position.endsWith("right")
      ? "right"
      : position.endsWith("center") || position === "center"
        ? "center"
        : "left",
    vertical: position.startsWith("bottom")
      ? "bottom"
      : position.startsWith("center-") || position === "center"
        ? "center"
        : "top",
  } as const;
}

function getImagePosition({
  canvas,
  width,
  height,
  margin,
  position,
}: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  margin: number;
  position: WatermarkSettings["position"];
}) {
  const marginPx = canvas.width * (margin / 100);
  const { horizontal, vertical } = getAlignment(position);

  return {
    x:
      horizontal === "right"
        ? canvas.width - marginPx - width
        : horizontal === "center"
          ? (canvas.width - width) / 2
          : marginPx,
    y:
      vertical === "bottom"
        ? canvas.height - marginPx - height
        : vertical === "center"
          ? (canvas.height - height) / 2
          : marginPx,
  };
}

function drawImageWatermark({
  canvas,
  context,
  watermarkImage,
  originalDimensions,
  imageScale,
  settings,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  watermarkImage: ImageBitmap;
  originalDimensions: ImageDimensions;
  imageScale: number;
  settings: WatermarkSettings;
}) {
  const originalWatermarkWidth =
    settings.imageSizeMode === "percentage"
      ? originalDimensions.width * (settings.imageSizeValue / 100)
      : settings.imageSizeValue;
  const width = originalWatermarkWidth * imageScale;
  const height = width * (watermarkImage.height / watermarkImage.width);
  const { x, y } = getImagePosition({
    canvas,
    width,
    height,
    margin: settings.margin,
    position: settings.position,
  });

  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate((settings.rotation * Math.PI) / 180);
  context.globalAlpha = settings.imageOpacity / 100;
  context.globalCompositeOperation = settings.imageBlendMode;
  context.drawImage(watermarkImage, -width / 2, -height / 2, width, height);
  context.restore();
}

function drawTextWatermark({
  canvas,
  context,
  originalDimensions,
  imageScale,
  settings,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  originalDimensions: ImageDimensions;
  imageScale: number;
  settings: WatermarkSettings;
}) {
  const baseFontSize =
    settings.fontSizeMode === "percentage"
      ? originalDimensions.width * (settings.fontSize / 100)
      : settings.fontSize;
  const fontSize = baseFontSize * imageScale;
  const marginPx = canvas.width * (settings.margin / 100);
  const { horizontal, vertical } = getAlignment(settings.position);

  const x =
    horizontal === "right"
      ? canvas.width - marginPx
      : horizontal === "center"
        ? canvas.width / 2
        : marginPx;
  const y =
    vertical === "bottom"
      ? canvas.height - marginPx
      : vertical === "center"
        ? canvas.height / 2
        : marginPx;

  context.save();
  context.font = `${settings.italic ? "italic" : "normal"} ${settings.fontWeight} ${fontSize}px ${settings.fontFamily}`;
  context.fillStyle = settings.color;
  context.globalAlpha = settings.opacity / 100;
  context.textAlign = horizontal;
  context.textBaseline = vertical === "center" ? "middle" : vertical;
  context.translate(x, y);
  context.rotate((settings.rotation * Math.PI) / 180);
  context.fillText(settings.text, 0, 0);

  if (settings.underline) {
    const textWidth = context.measureText(settings.text).width;
    const underlineX =
      horizontal === "right"
        ? -textWidth
        : horizontal === "center"
          ? -textWidth / 2
          : 0;
    const underlineY =
      vertical === "top"
        ? fontSize * 1.05
        : vertical === "center"
          ? fontSize * 0.55
          : fontSize * 0.05;
    context.fillRect(
      underlineX,
      underlineY,
      textWidth,
      Math.max(1, fontSize * 0.1),
    );
  }

  context.restore();
}

function renderWatermark({
  canvas,
  image,
  watermarkImage,
  originalDimensions,
  settings,
}: RenderWatermarkOptions) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const imageScale = image.width / originalDimensions.width;
  if (settings.type === "image") {
    if (watermarkImage)
      drawImageWatermark({
        canvas,
        context,
        watermarkImage,
        originalDimensions,
        imageScale,
        settings,
      });
    return;
  }

  drawTextWatermark({
    canvas,
    context,
    originalDimensions,
    imageScale,
    settings,
  });
}

export default renderWatermark;
