import { useEffect, useState } from "react";

type ToolbarProps = {
  file: File | undefined;
  imageCount: number;
  selectedIndex: number;
};

function Toolbar({ file, imageCount, selectedIndex }: ToolbarProps) {
  if (!file) {
    return (
      <div className="w-full text-sm text-zinc-400 border-b border-border px-4 py-3">
        <span>No Image Uploaded</span>
      </div>
    );
  }

  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!file) {
      setResolution(null);
      return;
    }

    let cancelled = false;

    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      if (cancelled) return;

      setResolution({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });

      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      if (cancelled) return;

      setResolution(null);
      URL.revokeObjectURL(url);
    };

    image.src = url;

    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatType = (type: string) => {
    return type.split("/")[1].toUpperCase() ?? "Unknown";
  };

  return (
    <div className="flex w-full justify-between shrink-0 items-center text-sm text-zinc-400 border-b border-border px-4 py-3">
      <div className="flex truncate">
        <div className="shrink-0 border-r border-border pr-4">
          {selectedIndex + 1}/{imageCount}
        </div>
        <div className="shrink truncate px-4">
          <span className="min-w-0">{file.name}</span>
        </div>
      </div>
      <div className="flex shrink-0">
        <div className="shrink-0 border-x border-border px-4">
          {formatBytes(file.size)}
        </div>
        <div className="shrink-0 border-r border-border px-4">
          {formatType(file.type)}
        </div>
        <div className="shrink-0 pl-4">
          {resolution
            ? `${resolution.width} x ${resolution.height}`
            : "Loading..."}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
