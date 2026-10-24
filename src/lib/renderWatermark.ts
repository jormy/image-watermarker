type RenderWatermarkOptions = {
  canvas: HTMLCanvasElement;
  image: ImageBitmap;
  maxDimension?: number;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  watermarkColor: string;
  position: string;
  margin: number;
};

function renderWatermark({
  canvas,
  image,
  maxDimension,
  watermarkText,
  fontSize,
  opacity,
  watermarkColor,
  position,
  margin,
}: RenderWatermarkOptions) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const scale = Math.min(
    1,
    (maxDimension ?? Infinity) / Math.max(image.width, image.height),
  );

  canvas.width = Math.round(scale * image.width);
  canvas.height = Math.round(scale * image.height);

  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const marginPx = canvas.width * (margin / 100);

  context.font = `bold ${fontSize * scale}px sans-serif`;
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
    ? canvas.width - marginPx
    : context.textAlign === "center"
      ? canvas.width / 2
      : marginPx;

  const y = position.startsWith("bottom")
    ? canvas.height - marginPx
    : context.textBaseline === "middle"
      ? canvas.height / 2
      : marginPx;

  context.fillText(watermarkText, x, y);
  context.globalAlpha = 1;
}

export default renderWatermark;
