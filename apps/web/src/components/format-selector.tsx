import { useVideoQualityOptions, type VideoQualityOption } from "@vidstack/react";
import { DefaultMenuRadioGroup, DefaultMenuSection } from "@vidstack/react/player/layouts/default";

type CodecFamily = "H.264" | "VP9";

function codecFamily(codec: string | null): CodecFamily | null {
  if (!codec) return null;
  if (codec.startsWith("avc1")) return "H.264";
  if (codec.startsWith("vp09") || codec === "vp9") return "VP9";
  return null;
}

function activeFamily(options: VideoQualityOption[]): CodecFamily | null {
  const selected = options.find((o) => o.selected && o.quality !== null);
  if (!selected?.quality) return null;
  return codecFamily(selected.quality.codec);
}

function groupByFamily(options: VideoQualityOption[]): Map<CodecFamily, VideoQualityOption> {
  const groups = new Map<CodecFamily, VideoQualityOption>();
  for (const option of options) {
    if (option.quality === null) continue;
    const family = codecFamily(option.quality.codec);
    if (family && !groups.has(family)) {
      groups.set(family, option);
    }
  }
  return groups;
}

const FORMAT_OPTIONS: { label: string; value: CodecFamily }[] = [
  { label: "H.264", value: "H.264" },
  { label: "VP9", value: "VP9" },
];

export function FormatSelector() {
  const options = useVideoQualityOptions({ sort: "descending" });

  const videoOptions = options.filter((o) => o.quality !== null);
  const groups = groupByFamily(videoOptions);

  if (groups.size <= 1) return null;

  const current = activeFamily(videoOptions) ?? "H.264";

  const availableOptions = FORMAT_OPTIONS.filter((f) => groups.has(f.value));

  function onChange(value: string) {
    const family = value as CodecFamily;
    const best = groups.get(family);
    if (best) best.select();
  }

  return (
    <DefaultMenuSection label="Format">
      <DefaultMenuRadioGroup value={current} options={availableOptions} onChange={onChange} />
    </DefaultMenuSection>
  );
}
