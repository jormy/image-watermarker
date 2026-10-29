import { useState } from "react";
import type { WatermarkPosition, WatermarkSettings } from "../types/watermark";
import { FaUnderline, FaItalic, FaSearch } from "react-icons/fa";
import FontPicker from "./FontPicker";

type SidebarProps = {
  fileCount: number;
  settings: WatermarkSettings;
  onAddFiles: (files: File[]) => void;
  onWatermarkChange: (updates: Partial<WatermarkSettings>) => void;
  imageWidth: number | undefined;
};

const fonts = [
  { label: "Sans serif", value: "sans-serif" },
  { label: "Arial", value: "Arial" },
  { label: "Helveitca", value: "Helvetica" },
  { label: "Serif", value: "serif" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Georgia", value: "Georgia" },
  { label: "Monospace", value: "monospace" },
  { label: "Courier New", value: "Courier New" },
  { label: "Cursive", value: "cursive" },
];

const fontWeights = [
  { label: "100", value: "100" },
  { label: "200", value: "200" },
  { label: "300", value: "300" },
  { label: "400", value: "400" },
  { label: "500", value: "500" },
  { label: "600", value: "600" },
  { label: "700", value: "700" },
  { label: "800", value: "800" },
  { label: "900", value: "900" },
];

const positions: { value: WatermarkPosition }[] = [
  { value: "top-left" },
  { value: "top-center" },
  { value: "top-right" },
  { value: "center-left" },
  { value: "center" },
  { value: "center-right" },
  { value: "bottom-left" },
  { value: "bottom-center" },
  { value: "bottom-right" },
];

function Sidebar({
  fileCount,
  settings,
  onAddFiles,
  onWatermarkChange,
  imageWidth,
}: SidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const isPresetFont = fonts.some((font) => font.value === settings.fontFamily);

  return (
    <aside className="flex w-96 shrink-0 flex-col overflow-y-auto border-r border-border p-6">
      <div>
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Logo" className="size-8" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Image Watermarker
          </h1>
        </div>
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
          className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${isDragging ? "border-white bg-white/10" : "border-border bg-zinc-900/50"}`}
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
            <label className="text-md mb-2 block font-medium">
              Font Family
            </label>
            <div className="mb-2 flex gap-2">
              <select
                value={settings.fontFamily}
                onChange={(event) =>
                  onWatermarkChange({ fontFamily: event.target.value })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white outline-none focus:border-zinc-500"
              >
                {!isPresetFont && (
                  <option value={settings.fontFamily}>
                    {settings.fontFamily}
                  </option>
                )}
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>

              <select
                value={settings.fontWeight}
                onChange={(event) =>
                  onWatermarkChange({
                    fontWeight: event.target
                      .value as WatermarkSettings["fontWeight"],
                  })
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white outline-none focus:border-zinc-500"
              >
                {fontWeights.map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex divide-x divide-zinc-950 overflow-hidden rounded-lg">
                <button
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center border transition-colors ${settings.italic ? "border-accent bg-accent text-black" : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"}`}
                  onClick={() =>
                    onWatermarkChange({ italic: !settings.italic })
                  }
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center border transition-colors ${settings.underline ? "border-accent bg-accent text-black" : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"}`}
                  onClick={() =>
                    onWatermarkChange({ underline: !settings.underline })
                  }
                >
                  <FaUnderline />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFontPickerOpen(true)}
                aria-label="Browse Google Fonts"
                className="flex h-10 items-center gap-2 rounded-lg border border-accent bg-accent/20 px-3 text-white transition-colors hover:bg-accent/30"
              >
                <FaSearch className="size-3.5" />
                <span>Browse Fonts</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-md mb-2 block font-medium">Text</label>
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
            <label className="text-md mb-2 block font-medium">Font Size</label>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                className={`flex-1 rounded-md px-2 py-1 transition ${settings.fontSizeMode === "px" ? "bg-accent text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"}`}
                onClick={() => {
                  if (settings.fontSizeMode === "px") return;
                  const newFontSize = imageWidth
                    ? Math.round((settings.fontSize / 100) * imageWidth)
                    : settings.fontSize;

                  onWatermarkChange({
                    fontSizeMode: "px",
                    fontSize: Math.min(500, Math.max(10, newFontSize)),
                  });
                }}
              >
                px
              </button>
              <button
                type="button"
                className={`flex-1 rounded-md px-2 py-1 transition ${settings.fontSizeMode === "percentage" ? "bg-accent text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"}`}
                onClick={() => {
                  if (settings.fontSizeMode === "percentage") return;
                  const newFontSize = imageWidth
                    ? Math.round((settings.fontSize / imageWidth) * 100 * 100) /
                      100
                    : settings.fontSize;

                  onWatermarkChange({
                    fontSizeMode: "percentage",
                    fontSize: Math.min(100, Math.max(1, newFontSize)),
                  });
                }}
              >
                %
              </button>
            </div>

            <div className="flex gap-2">
              <div>
                <div className="flex w-25 items-center rounded-lg border border-zinc-700 bg-zinc-900 focus-within:border-zinc-500">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.fontSize}
                    onChange={(event) =>
                      onWatermarkChange({
                        fontSize: Number(event.target.value),
                      })
                    }
                    className="no-spinner min-w-0 flex-1 bg-transparent p-2 text-white outline-none"
                  />
                  <span className="pr-2 text-zinc-400">
                    {settings.fontSizeMode === "px" ? "px" : "%"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={settings.fontSizeMode === "px" ? "10" : "1"}
                max={settings.fontSizeMode === "px" ? "500" : "100"}
                step="0.01"
                value={settings.fontSize}
                onChange={(event) =>
                  onWatermarkChange({ fontSize: Number(event.target.value) })
                }
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-md mb-2 block font-medium">Opacity</label>
            <div className="flex gap-2">
              <div className="flex w-25 items-center rounded-lg border border-zinc-700 bg-zinc-900 focus-within:border-zinc-500">
                <input
                  type="number"
                  step="0.01"
                  value={String(settings.opacity).replace(/^0+(?=\d)/, "")}
                  onChange={(event) =>
                    onWatermarkChange({ opacity: Number(event.target.value) })
                  }
                  className="no-spinner min-w-0 flex-1 bg-transparent p-2 text-white outline-none"
                />
                <span className="pr-2 text-zinc-400">%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.01"
                value={settings.opacity}
                onChange={(event) =>
                  onWatermarkChange({ opacity: Number(event.target.value) })
                }
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-md mb-2 block font-medium">Color</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.color}
                onChange={(event) =>
                  onWatermarkChange({
                    color: event.target.value.startsWith("#")
                      ? event.target.value
                      : `#${event.target.value}`,
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white outline-none focus:border-zinc-500"
              ></input>
              <input
                type="color"
                value={settings.color}
                onChange={(event) =>
                  onWatermarkChange({ color: event.target.value })
                }
                className="h-10 w-14 rounded-lg border-0 bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-md mb-2 block font-medium">
              Margin: {settings.margin}%
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.01"
              value={settings.margin}
              onChange={(event) =>
                onWatermarkChange({ margin: Number(event.target.value) })
              }
              className="w-full accent-accent"
            />
          </div>

          <div>
            <label className="text-md mb-2 block font-medium">Position</label>
            <div className="grid w-fit grid-cols-3 gap-2 rounded-lg border border-border bg-zinc-900 p-2">
              {positions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onWatermarkChange({ position: item.value })}
                  className={`flex size-8 items-center justify-center rounded-lg transition-colors ${settings.position === item.value ? "bg-accent text-black" : "text-zinc-400 hover:bg-zinc-800"}`}
                  aria-label={item.value}
                  aria-pressed={settings.position === item.value}
                >
                  ●
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isFontPickerOpen && (
        <FontPicker
          value={settings.fontFamily}
          previewText={settings.text}
          onChange={(fontFamily) => onWatermarkChange({ fontFamily })}
          onClose={() => setIsFontPickerOpen(false)}
        />
      )}
    </aside>
  );
}

export default Sidebar;
