async function createPreview(
  file: File,
  maxDimension = 1600,
): Promise<ImageBitmap> {
  const image = await createImageBitmap(file);

  try {
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height),
    );

    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create preview canvas");
    }

    context.drawImage(image, 0, 0, width, height);

    return await createImageBitmap(canvas);
  } finally {
    image.close();
  }
}

export default createPreview;
