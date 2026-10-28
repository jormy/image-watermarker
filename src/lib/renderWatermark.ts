import type { ImageDimensions } from "../types/image";
import type { WatermarkSettings } from "../types/watermark";

type RenderWatermarkOptions = {
  canvas: HTMLCanvasElement;
  image: ImageBitmap;
  originalDimensions: ImageDimensions;
  settings: WatermarkSettings;
};

function renderWatermark({
  canvas,
  image,
  originalDimensions,
  settings,
}: RenderWatermarkOptions) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const imageScale = image.width / originalDimensions.width;
  const fontStyle = settings.italic ? "italic" : "normal";

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const marginPx = canvas.width * (settings.margin / 100);
  const baseFontSize =
    settings.fontSizeMode === "percentage"
      ? originalDimensions.width * (settings.fontSize / 100)
      : settings.fontSize;
  const scaledFontSize = baseFontSize * imageScale;

  context.font = `${fontStyle} ${settings.fontWeight} ${scaledFontSize}px ${settings.fontFamily}`;
  context.fillStyle = settings.color;
  context.globalAlpha = settings.opacity / 100;
  context.textAlign = settings.position.endsWith("right")
    ? "right"
    : settings.position.endsWith("center") || settings.position === "center"
      ? "center"
      : "left";
  context.textBaseline = settings.position.startsWith("bottom")
    ? "bottom"
    : settings.position.startsWith("center-") || settings.position === "center"
      ? "middle"
      : "top";

  const x =
    context.textAlign === "right"
      ? canvas.width - marginPx
      : context.textAlign === "center"
        ? canvas.width / 2
        : marginPx;
  const y =
    context.textBaseline === "bottom"
      ? canvas.height - marginPx
      : context.textBaseline === "middle"
        ? canvas.height / 2
        : marginPx;

  context.fillText(settings.text, x, y);

  if (settings.underline) {
    const metrics = context.measureText(settings.text);
    const textWidth = metrics.width;
    const underlineGap = scaledFontSize * 0.05;
    const underlineY =
      context.textBaseline === "top"
        ? y + scaledFontSize + underlineGap
        : context.textBaseline === "middle"
          ? y + scaledFontSize / 2 + underlineGap
          : y + underlineGap;
    const underlineThickness = Math.max(1, scaledFontSize * 0.1);

    let underlineX = x;

    if (context.textAlign === "center") {
      underlineX = x - textWidth / 2;
    } else if (context.textAlign === "right") {
      underlineX = x - textWidth;
    }

    context.fillRect(underlineX, underlineY, textWidth, underlineThickness);
  }

  context.globalAlpha = 1;
}

export default renderWatermark;
