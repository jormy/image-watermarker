import { useEffect, useRef, useState } from "react";
import ImagePreview from "./components/ImagePreview";
import Sidebar from "./components/Sidebar";
import ThumbnailStrip from "./components/ThumbnailStrip";
import type { WatermarkSettings } from "./types/watermark";
import Toolbar from "./components/Toolbar";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>(
    {
      type: "text",
      text: "Sample Watermark",
      fontSize: 24,
      fontFamily: "sans-serif",
      fontWeight: "normal",
      color: "#FFFFFF",
      opacity: 0.5,
      position: "bottom-right",
      margin: 10,
      rotation: 0,
    },
  );
  const updateWatermarkSettings = (updates: Partial<WatermarkSettings>) => {
    setWatermarkSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  const [showMarginGuide, setShowMarginGuide] = useState(false);
  const marginGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [thumbnailHeight, setThumbnailHeight] = useState(144);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMarginChange = (value: number) => {
    updateWatermarkSettings({ margin: value });

    setShowMarginGuide(true);

    if (marginGuideTimeoutRef.current) {
      clearTimeout(marginGuideTimeoutRef.current);
    }

    marginGuideTimeoutRef.current = setTimeout(() => {
      setShowMarginGuide(false);
      marginGuideTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(
    () => () => {
      if (marginGuideTimeoutRef.current)
        clearTimeout(marginGuideTimeoutRef.current);
    },
    [],
  );

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    setFiles((currentFiles) => [...currentFiles, ...imageFiles]);
  };

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return (
    <main className="flex h-dvh w-screen overflow-hidden bg-zinc-950 text-white">
      <Sidebar
        fileCount={files.length}
        settings={watermarkSettings}
        onAddFiles={addFiles}
        onWatermarkChange={(updates) => {
          if (updates.margin !== undefined) {
            handleMarginChange(updates.margin);
          } else {
            updateWatermarkSettings(updates);
          }
        }}
      />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Toolbar
          file={files[selectedIndex]}
          imageCount={files.length}
          selectedIndex={selectedIndex}
        />
        <ImagePreview
          file={files[selectedIndex]}
          settings={watermarkSettings}
          showMarginGuide={showMarginGuide}
        />
        <ThumbnailStrip
          files={files}
          previews={previews}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          height={thumbnailHeight}
          onHeightChange={setThumbnailHeight}
        />
      </section>
    </main>
  );
}

export default App;
