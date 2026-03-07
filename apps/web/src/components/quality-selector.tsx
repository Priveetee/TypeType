import type { MenuInstance } from "@vidstack/react";
import { Menu } from "@vidstack/react";
import { DefaultMenuButton, DefaultMenuRadioGroup } from "@vidstack/react/player/layouts/default";
import { useRef, useState } from "react";
import type { QualityStream } from "../types/stream";

type FormatLabel = "H.264" | "VP9" | "AV1";

const FORMAT_OPTIONS: { label: string; value: FormatLabel }[] = [
  { label: "H.264", value: "H.264" },
  { label: "VP9", value: "VP9" },
  { label: "AV1", value: "AV1" },
];

function isFormatLabel(v: string): v is FormatLabel {
  return v === "H.264" || v === "VP9" || v === "AV1";
}

function codecFamily(stream: QualityStream): FormatLabel | null {
  const c = stream.codec ?? "";
  if (c.startsWith("av01")) return "AV1";
  if (c.startsWith("vp09")) return "VP9";
  if (c.startsWith("avc1")) return "H.264";
  return null;
}

function streamKey(s: QualityStream): string {
  return `${s.resolution}|${s.format}|${s.codec ?? ""}`;
}

function bestInFormat(streams: QualityStream[], format: FormatLabel): QualityStream | undefined {
  return streams.filter((s) => codecFamily(s) === format).sort((a, b) => b.bitrate - a.bitrate)[0];
}

function deduplicateByResolution(streams: QualityStream[]): QualityStream[] {
  const seen = new Set<string>();
  return streams.filter((s) => {
    if (seen.has(s.resolution)) return false;
    seen.add(s.resolution);
    return true;
  });
}

type Props = {
  streams: QualityStream[];
  selected: QualityStream;
  onSelect: (stream: QualityStream) => void;
};

export function QualitySelector({ streams, selected, onSelect }: Props) {
  const formatMenuRef = useRef<MenuInstance>(null);
  const qualityMenuRef = useRef<MenuInstance>(null);

  const [selectedFormat, setSelectedFormat] = useState<FormatLabel>(
    () => codecFamily(selected) ?? "H.264",
  );

  const availableFormats = FORMAT_OPTIONS.filter((opt) =>
    streams.some((s) => codecFamily(s) === opt.value),
  );

  const formatStreams = deduplicateByResolution(
    streams.filter((s) => codecFamily(s) === selectedFormat).sort((a, b) => b.bitrate - a.bitrate),
  );
  const activeInFormat = formatStreams.find((s) => streamKey(s) === streamKey(selected));

  const qualityOptions = formatStreams.map((s) => ({
    label: s.resolution,
    value: streamKey(s),
  }));

  function handleFormatChange(value: string) {
    if (!isFormatLabel(value)) return;
    setSelectedFormat(value);
    const best = bestInFormat(streams, value);
    if (best) onSelect(best);
    formatMenuRef.current?.close();
  }

  function handleQualityChange(value: string) {
    const stream = formatStreams.find((s) => streamKey(s) === value);
    if (stream) onSelect(stream);
    qualityMenuRef.current?.close();
  }

  return (
    <>
      <Menu.Root key="format-menu" ref={formatMenuRef}>
        <DefaultMenuButton label="Format" hint={selectedFormat} />
        <Menu.Items className="vds-menu-items">
          <DefaultMenuRadioGroup
            value={selectedFormat}
            options={availableFormats}
            onChange={handleFormatChange}
          />
        </Menu.Items>
      </Menu.Root>
      <Menu.Root key="quality-menu" ref={qualityMenuRef}>
        <DefaultMenuButton
          label="Quality"
          hint={activeInFormat?.resolution ?? formatStreams[0]?.resolution}
        />
        <Menu.Items className="vds-menu-items">
          <DefaultMenuRadioGroup
            value={activeInFormat ? streamKey(activeInFormat) : ""}
            options={qualityOptions}
            onChange={handleQualityChange}
          />
        </Menu.Items>
      </Menu.Root>
    </>
  );
}
