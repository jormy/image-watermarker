import { useState, useEffect, useRef } from "react";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    setFiles((currentFiles) => [...currentFiles, ...imageFiles]);
  };

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!files[0] || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const processImage = async () => {
      const image = await createImageBitmap(files[0]);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      ctx.font = "bold 64px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText("MY WATERMARK", 50, 100);

      image.close();
    };

    processImage();
  }, [files]);

  return (
    <main className="absolute inset-0 min-h-screen w-screen overflow-auto bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Image Watermarker
          </h1>

          <p className="mt-2 text-zinc-400">
            Watermark your images directly in your browser.
          </p>

          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => {
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);

              const droppedFiles = Array.from(event.dataTransfer.files);
              addFiles(droppedFiles);
            }}
            className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${isDragging ? "border-white bg-white/10" : "border-zinc-700 bg-zinc-900/50"}`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                const selectedFiles = Array.from(event.target.files ?? []);
                addFiles(selectedFiles);
              }}
            />

            <p className="font-medium">
              {isDragging ? "Drop your images here" : "Drag & drop your images"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">or click to browse</p>
          </label>
          <p className="mt-2 text-zinc-400">{files.length} file(s) selected.</p>
          <canvas ref={canvasRef} className="mt-6 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {previews.map((preview, index) => (
            <div key={files[index].name}>
              <img
                src={preview}
                alt={files[index].name}
                className="aspect-auto w-full rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
