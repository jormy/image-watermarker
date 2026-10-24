import type { ImageDimensions } from "../types/image";

type ToolbarProps = {
  file: File | undefined;
  imageCount: number;
  selectedIndex: number;
  originalDimensions: ImageDimensions | undefined;
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
}: ToolbarProps) {
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
        <div className="ml-4 flex shrink-0 gap-2">
          <button className="cursor-pointer rounded-md bg-accent px-2.5 py-1.5 text-zinc-950">
            Export Selected
          </button>
          <button className="cursor-pointer rounded-md bg-accent px-2.5 py-1.5 text-zinc-950">
            Export All
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
