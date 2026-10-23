import { useEffect, useRef, useState } from "react";
import ImagePreview from "./components/ImagePreview";
import Sidebar from "./components/Sidebar";
import ThumbnailStrip from "./components/ThumbnailStrip";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [watermarkText, setWatermarkText] = useState("MY WATERMARK");
  const [fontSize, setFontSize] = useState(64);
  const [opacity, setOpacity] = useState(70);
  const [watermarkColor, setWatermarkColor] = useState("#ffffff");
  const [position, setPosition] = useState("bottom-right");
  const [margin, setMargin] = useState(3);
  const [showMarginGuide, setShowMarginGuide] = useState(false);
  const marginGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thumbnailHeight, setThumbnailHeight] = useState(144);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMarginChange = (value: number) => {
    setMargin(value);
    setShowMarginGuide(true);
    if (marginGuideTimeoutRef.current) clearTimeout(marginGuideTimeoutRef.current);
    marginGuideTimeoutRef.current = setTimeout(() => {
      setShowMarginGuide(false);
      marginGuideTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => () => {
    if (marginGuideTimeoutRef.current) clearTimeout(marginGuideTimeoutRef.current);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));
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
        watermarkText={watermarkText}
        fontSize={fontSize}
        opacity={opacity}
        watermarkColor={watermarkColor}
        margin={margin}
        position={position}
        onAddFiles={addFiles}
        onWatermarkTextChange={setWatermarkText}
        onFontSizeChange={setFontSize}
        onOpacityChange={setOpacity}
        onWatermarkColorChange={setWatermarkColor}
        onMarginChange={handleMarginChange}
        onPositionChange={setPosition}
      />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ImagePreview
          file={files[selectedIndex]}
          watermarkText={watermarkText}
          fontSize={fontSize}
          opacity={opacity}
          watermarkColor={watermarkColor}
          position={position}
          margin={margin}
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
