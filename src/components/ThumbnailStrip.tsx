import { useState } from "react";
import { FaTimes } from "react-icons/fa";

type ThumbnailStripProps = {
  files: File[];
  previews: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  height: number;
  onHeightChange: (height: number) => void;
  onRemove: (index: number) => void;
};

function ThumbnailStrip({
  files,
  previews,
  selectedIndex,
  onSelect,
  height,
  onHeightChange,
  onRemove,
}: ThumbnailStripProps) {
  const [isResizing, setIsResizing] = useState(false);
  return (
    <>
      <div
        role="separator"
        aria-label="Resize thumbnail panel"
        aria-orientation="horizontal"
        aria-valuenow={height}
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
          const newHeight = bounds.bottom - event.clientY;
          onHeightChange(
            Math.max(
              112,
              Math.min(Math.min(480, bounds.height * 0.65), newHeight),
            ),
          );
        }}
        onPointerUp={() => setIsResizing(false)}
        onPointerCancel={() => setIsResizing(false)}
        className="group relative z-10 flex h-3 shrink-0 cursor-row-resize items-center justify-center border-t border-border bg-zinc-950"
      >
        <div
          className={`h-1 w-12 rounded-full transition-colors ${isResizing ? "bg-accent" : "bg-border group-hover:bg-accent"}`}
        />
      </div>
      <div
        style={{ height }}
        className="flex shrink-0 items-center gap-4 overflow-x-auto overflow-y-hidden px-6 py-3"
      >
        {previews.map((preview, index) => (
          <div
            key={`${files[index].name}-${index}`}
            className="group relative h-full shrink-0"
          >
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={`h-full cursor-pointer overflow-hidden rounded-lg ring-2 ring-offset-4 ring-offset-zinc-950 transition ${
                selectedIndex === index
                  ? "ring-accent"
                  : "ring-transparent hover:ring-4 hover:ring-zinc-600 hover:ring-offset-0"
              }`}
            >
              <img
                src={preview}
                alt={files[index].name}
                className="h-full w-auto object-contain"
              />
            </button>

            <button
              type="button"
              aria-label={`Remove ${files[index].name}`}
              title="Remove image"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600 focus:opacity-100"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default ThumbnailStrip;
