import type { ExportFormat } from "../types/export";
import type { ImageDimensions } from "../types/image";
import { FiDownload } from "react-icons/fi";

type ToolbarProps = {
  file: File | undefined;
  imageCount: number;
  selectedIndex: number;
  originalDimensions: ImageDimensions | undefined;
  exportingAction: "selected" | "all" | null;
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  onExportSelected: () => void;
  onExportAll: () => void;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** unitIndex).toFixed(2)} ${units[unitIndex]}`;
}

function formatType(type: string) {
  return type.split("/")[1]?.toUpperCase() ?? "Unknown";
}

function Toolbar({
  file,
  imageCount,
  selectedIndex,
  originalDimensions,
  exportingAction,
  exportFormat,
  onExportFormatChange,
  onExportSelected,
  onExportAll,
}: ToolbarProps) {
  const isExporting = exportingAction !== null;

  if (!file) {
    return (
      <div className="w-full border-b border-border px-4 py-3 text-sm text-zinc-400">
        No Image Uploaded
      </div>
    );
  }

  return (
    <div className="flex w-full shrink-0 items-center justify-between border-b border-border px-4 text-sm text-zinc-400">
      <div className="flex truncate py-3">
        <div className="shrink-0 border-r border-border pr-4">
          {selectedIndex + 1}/{imageCount}
        </div>
        <div className="shrink truncate px-4">{file.name}</div>
      </div>
      <div className="flex shrink-0 items-center">
        <div className="shrink-0 border-x border-border px-4">
          {formatBytes(file.size)}
        </div>
        <div className="shrink-0 border-r border-border px-4">
          {formatType(file.type)}
        </div>
        <div className="shrink-0 border-r border-border px-4">
          {originalDimensions
            ? `${originalDimensions.width} x ${originalDimensions.height}`
            : "Loading..."}
        </div>

        <div className="ml-4 flex items-center gap-1.5">
          <div className="flex h-7.5 divide-x divide-zinc-950 overflow-hidden rounded-lg bg-accent text-zinc-950">
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportSelected}
              className="flex cursor-pointer items-center gap-1 px-2.5 transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
            >
              <FiDownload className="size-3.5" />
              {exportingAction === "selected" ? "Exporting..." : "Selected"}
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportAll}
              className="flex cursor-pointer items-center gap-1 px-2.5 transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
            >
              <FiDownload className="size-3.5" />
              {exportingAction === "all" ? "Exporting..." : "All"}
            </button>
          </div>
          <select
            value={exportFormat}
            disabled={isExporting}
            onChange={(event) =>
              onExportFormatChange(event.target.value as ExportFormat)
            }
            className="h-7.5 cursor-pointer rounded-lg border border-border bg-zinc-800 px-3 text-white transition hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
            aria-label="Export format"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="source">Source</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
