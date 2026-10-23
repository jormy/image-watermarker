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
  const [thumbnailHeight, setThumbnailHeight] = useState(144);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    const selectedFile = files[selectedIndex];

    if (!selectedFile || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const processImage = async () => {
      const image = await createImageBitmap(selectedFile);

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
    selectedIndex,
    files,
    watermarkText,
    fontSize,
    opacity,
    watermarkColor,
    position,
    margin,
  ]);

  return (
    <main className="flex h-dvh w-screen overflow-hidden bg-zinc-950 text-white">
      <aside className="flex w-96 shrink-0 flex-col overflow-y-auto border-r border-zinc-800 p-6">
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
              <label className="mb-2 block text-md font-medium">
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
              <label className="mb-2 block text-md font-medium">Position</label>

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
        </div>
      </aside>

      <section
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${
          isResizing ? "select-none" : ""
        }`}
      >
        {/* Main image preview */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
          <canvas
            ref={canvasRef}
            className="block max-h-full max-w-full object-contain"
          />

          {/* Margin guide */}
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
              showMarginGuide ? "opacity-100" : "opacity-0"
            }`}
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

        {/* Resizable divider */}
        <div
          role="separator"
          aria-label="Resize thumbnail panel"
          aria-orientation="horizontal"
          aria-valuenow={thumbnailHeight}
          aria-valuemin={112}
          aria-valuemax={Math.min(480, window.innerHeight * 0.65)}
          tabIndex={0}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsResizing(true);
          }}
          onPointerMove={(event) => {
            if (!isResizing) return;

            const section = event.currentTarget.parentElement;
            if (!section) return;

            const bounds = section.getBoundingClientRect();
            const maxHeight = Math.min(480, bounds.height * 0.65);
            const newHeight = bounds.bottom - event.clientY;

            setThumbnailHeight(Math.max(112, Math.min(maxHeight, newHeight)));
          }}
          onPointerUp={() => setIsResizing(false)}
          onPointerCancel={() => setIsResizing(false)}
          className="group relative z-10 flex h-3 shrink-0 cursor-row-resize items-center justify-center border-t border-zinc-800 bg-zinc-950"
        >
          <div
            className={`h-1 w-12 rounded-full transition-colors ${
              isResizing ? "bg-accent" : "bg-zinc-700 group-hover:bg-accent"
            }`}
          />
        </div>

        {/* Thumbnail panel */}
        <div
          style={{ height: thumbnailHeight }}
          className="flex shrink-0 items-center gap-4 overflow-x-auto overflow-y-hidden px-6 py-3"
        >
          {previews.map((preview, index) => (
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              key={files[index].name}
              className={`h-full shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 transition ring-offset-4 ring-offset-zinc-950 ${
                selectedIndex === index
                  ? "ring-accent"
                  : "ring-transparent hover:ring-zinc-600 hover:ring-4 hover:ring-offset-0"
              }`}
            >
              <img
                src={preview}
                alt={files[index].name}
                className="h-full w-auto object-contain"
              />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
