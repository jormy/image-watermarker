import { useState, useEffect, useRef } from "react";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [watermarkText, setWatermarkText] = useState("MY WATERMARK");
  const [fontSize, setFontSize] = useState(64);
  const [opacity, setOpacity] = useState(70);
  const [watermarkColor, setWatermarkColor] = useState("#ffffff");
  const [position, setPosition] = useState("bottom-right");
  const [margin, setMargin] = useState(3);
  const [showMarginGuide, setShowMarginGuide] = useState(false);
  const marginGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleMarginChange = (value: number) => {
    setMargin(value);
    setShowMarginGuide(true);

    if (marginGuideTimeoutRef.current) {
      clearTimeout(marginGuideTimeoutRef.current);
    }

    marginGuideTimeoutRef.current = setTimeout(() => {
      setShowMarginGuide(false);
      marginGuideTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (marginGuideTimeoutRef.current) {
        clearTimeout(marginGuideTimeoutRef.current);
      }
    };
  }, []);

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

      const marginPx = image.width * (margin / 100);

      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = watermarkColor;
      ctx.globalAlpha = opacity / 100;

      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      let x = marginPx;
      let y = marginPx;

      // horizontal alignment
      if (position.endsWith("right")) {
        ctx.textAlign = "right";
        x = image.width - marginPx;
      } else if (position.endsWith("center") || position === "center") {
        ctx.textAlign = "center";
        x = image.width / 2;
      }

      // vertical alignment
      if (position.startsWith("bottom")) {
        ctx.textBaseline = "bottom";
        y = image.height - marginPx;
      } else if (position.startsWith("center-") || position === "center") {
        ctx.textBaseline = "middle";
        y = image.height / 2;
      }

      ctx.fillText(watermarkText, x, y);
      ctx.globalAlpha = 1;

      image.close();
    };

    processImage();
  }, [
    files,
    watermarkText,
    fontSize,
    opacity,
    watermarkColor,
    position,
    margin,
  ]);

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

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-md font-medium">
                Watermark Text
              </label>

              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-md font-medium">
                Font Size: {fontSize}px
              </label>

              <input
                type="range"
                min="10"
                max="200"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <label className="mb-2 block text-md font-medium">
                Opacity: {opacity}%
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <label className="mb-2 block text-md font-medium">
                Watermark Color
              </label>

              <input
                type="color"
                value={watermarkColor}
                onChange={(e) => setWatermarkColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Margin: {margin}%
              </label>

              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={margin}
                onChange={(event) =>
                  handleMarginChange(Number(event.target.value))
                }
                className="w-full accent-accent"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Position</label>

              <div className="grid w-fit grid-cols-3 gap-2">
                {[
                  { value: "top-left", label: "↖" },
                  { value: "top-center", label: "↑" },
                  { value: "top-right", label: "↗" },
                  { value: "center-left", label: "←" },
                  { value: "center", label: "●" },
                  { value: "center-right", label: "→" },
                  { value: "bottom-left", label: "↙" },
                  { value: "bottom-center", label: "↓" },
                  { value: "bottom-right", label: "↘" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPosition(item.value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                      position === item.value
                        ? "border-accent bg-accent text-black"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    }`}
                    aria-label={item.value}
                    aria-pressed={position === item.value}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 w-full overflow-hidden outline-1 outline-zinc-700">
            <canvas ref={canvasRef} className="w-full block h-auto" />

            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${showMarginGuide ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
            >
              <div
                className="absolute border border-dashed border-white/70"
                style={{
                  left: `${margin}%`,
                  right: `${margin}%`,
                  top: `${margin}%`,
                  bottom: `${margin}%`,
                }}
              />
            </div>
          </div>
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
