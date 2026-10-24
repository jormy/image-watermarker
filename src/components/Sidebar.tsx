import { useState } from "react";
import type { WatermarkPosition, WatermarkSettings } from "../types/watermark";
import {
  FiCrosshair,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpLeft,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiArrowDownRight,
} from "react-icons/fi";

type SidebarProps = {
  fileCount: number;
  settings: WatermarkSettings;
  onAddFiles: (files: File[]) => void;
  onWatermarkChange: (updates: Partial<WatermarkSettings>) => void;
};

const positions: { value: WatermarkPosition; icon: typeof FiCrosshair }[] = [
  { value: "top-left", icon: FiArrowUpLeft },
  { value: "top-center", icon: FiArrowUp },
  { value: "top-right", icon: FiArrowUpRight },
  { value: "center-left", icon: FiArrowLeft },
  { value: "center", icon: FiCrosshair },
  { value: "center-right", icon: FiArrowRight },
  { value: "bottom-left", icon: FiArrowDownLeft },
  { value: "bottom-center", icon: FiArrowDown },
  { value: "bottom-right", icon: FiArrowDownRight },
];

function Sidebar({
  fileCount,
  settings,
  onAddFiles,
  onWatermarkChange,
}: SidebarProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <aside className="flex w-96 shrink-0 flex-col overflow-y-auto border-r border-border p-6">
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
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            onAddFiles(Array.from(event.dataTransfer.files));
          }}
          className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${isDragging ? "border-white bg-white/10" : "border-zinc-700 bg-zinc-900/50"}`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) =>
              onAddFiles(Array.from(event.target.files ?? []))
            }
          />
          <p className="font-medium">
            {isDragging ? "Drop your images here" : "Drag & drop your images"}
          </p>
          <p className="mt-1 text-sm text-zinc-500">or click to browse</p>
        </label>
        <p className="mt-2 text-zinc-400">{fileCount} file(s) selected.</p>
        <div className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-md font-medium">
              Watermark Text
            </label>
            <input
              type="text"
              value={settings.text}
              onChange={(event) =>
                onWatermarkChange({ text: event.target.value })
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-md font-medium">
              Font Size: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={settings.fontSize}
              onChange={(event) =>
                onWatermarkChange({ fontSize: Number(event.target.value) })
              }
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-md font-medium">
              Opacity: {settings.opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.opacity}
              onChange={(event) =>
                onWatermarkChange({ opacity: Number(event.target.value) })
              }
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-md font-medium">
              Watermark Color
            </label>
            <input
              type="color"
              value={settings.color}
              onChange={(event) =>
                onWatermarkChange({ color: event.target.value })
              }
              className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
            />
          </div>
          <div>
            <label className="mb-2 block text-md font-medium">
              Margin: {settings.margin}%
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={settings.margin}
              onChange={(event) =>
                onWatermarkChange({ margin: Number(event.target.value) })
              }
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-md font-medium">Position</label>
            <div className="grid w-fit grid-cols-3 gap-2">
              {positions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onWatermarkChange({ position: item.value })}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${settings.position === item.value ? "border-accent bg-accent text-black" : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
                  aria-label={item.value}
                  aria-pressed={settings.position === item.value}
                >
                  <item.icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
