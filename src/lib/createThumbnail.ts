async function createThumbnail(
  file: File,
  maxDimension = 240,
): Promise<string> {
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
      throw new Error("Could not create thumbnail canvas");
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to generate thumbnail"));
          }
        },
        "image/webp",
        0.8,
      );
    });

    return URL.createObjectURL(blob);
  } finally {
    image.close();
  }
}

export default createThumbnail;
