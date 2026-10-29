import { useEffect, useMemo, useRef, useState } from "react";

type GoogleFont = {
  family: string;
};

type FontPickerProps = {
  value: string;
  previewText: string;
  onChange: (fontFamily: string) => void;
  onClose: () => void;
};

const ROW_HEIGHT = 52;
const LIST_OVERSCAN = 6;

function loadGoogleFont(family: string) {
  const id = `google-font-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

function FontListItem({
  font,
  isSelected,
  onSelect,
}: {
  font: GoogleFont;
  isSelected: boolean;
  onSelect: () => void;
}) {
  useEffect(() => {
    loadGoogleFont(font.family);
  }, [font.family]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-13 w-full items-center rounded-md px-3 text-left text-lg transition-colors ${isSelected ? "bg-accent text-zinc-950" : "text-white hover:bg-zinc-800"}`}
      style={{ fontFamily: font.family }}
    >
      {font.family}
    </button>
  );
}

function FontPicker({
  value,
  previewText,
  onChange,
  onClose,
}: FontPickerProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFont, setSelectedFont] = useState(value);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFonts() {
      try {
        const response = await fetch("/api/fonts", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Could not load Google Fonts.");

        const data = (await response.json()) as { items?: GoogleFont[] };
        setFonts(data.items ?? []);
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        )
          return;
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not load Google Fonts.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchFonts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    loadGoogleFont(selectedFont);
  }, [selectedFont]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const filteredFonts = useMemo(
    () =>
      fonts.filter((font) =>
        font.family.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [fonts, search],
  );
  const viewportHeight = 416;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - LIST_OVERSCAN,
  );
  const endIndex = Math.min(
    filteredFonts.length,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + LIST_OVERSCAN,
  );
  const visibleFonts = filteredFonts.slice(startIndex, endIndex);

  const selectFont = () => {
    onChange(selectedFont);
    onClose();
  };

  return (
    <div
      className="font-picker-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="font-picker-dialog flex h-[min(680px,calc(100dvh-3rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-zinc-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="font-picker-title"
      >
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex min-h-0 flex-col border-r border-border p-4">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setScrollTop(0);
                listRef.current?.scrollTo({ top: 0 });
              }}
              placeholder="Search fonts"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-accent"
              autoFocus
            />
            <p className="mt-3 text-sm text-zinc-400">
              {loading ? "Loading fonts…" : `${filteredFonts.length} fonts`}
            </p>
            <div
              ref={listRef}
              className="mt-2 min-h-0 flex-1 overflow-y-auto"
              onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
            >
              {error ? (
                <p className="p-3 text-sm text-red-300">{error}</p>
              ) : (
                <div style={{ height: filteredFonts.length * ROW_HEIGHT }}>
                  <div
                    style={{
                      transform: `translateY(${startIndex * ROW_HEIGHT}px)`,
                    }}
                  >
                    {visibleFonts.map((font) => (
                      <FontListItem
                        key={font.family}
                        font={font}
                        isSelected={selectedFont === font.family}
                        onSelect={() => setSelectedFont(font.family)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col p-8">
            <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
              Preview
            </p>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-zinc-900/50 p-8">
              <p
                className="warp-break-word max-w-full text-center text-5xl text-white"
                style={{ fontFamily: selectedFont }}
              >
                {previewText || "Sample Watermark"}
              </p>
            </div>
            <p
              className="mt-4 truncate text-center text-lg text-zinc-300"
              style={{ fontFamily: selectedFont }}
            >
              {selectedFont}
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={selectFont}
            className="rounded-md bg-accent px-4 py-2 font-medium text-zinc-950 hover:bg-accent/90"
          >
            Select
          </button>
        </footer>
      </section>
    </div>
  );
}

export default FontPicker;
