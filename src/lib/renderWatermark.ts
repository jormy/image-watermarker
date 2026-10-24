import type { PreviewAsset } from "../types/image";
import type { WatermarkSettings } from "../types/watermark";

type RenderWatermarkOptions = {
  canvas: HTMLCanvasElement;
  preview: PreviewAsset;
  settings: WatermarkSettings;
};

function renderWatermark({
  canvas,
  preview,
  settings,
}: RenderWatermarkOptions) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const { bitmap, originalDimensions } = preview;
  const previewScale = bitmap.width / originalDimensions.width;

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);

  const marginPx = canvas.width * (settings.margin / 100);
  context.font = `${settings.fontWeight} ${settings.fontSize * previewScale}px ${settings.fontFamily}`;
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
  context.globalAlpha = 1;
}

export default renderWatermark;
