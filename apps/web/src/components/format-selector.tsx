import { useRef } from "react";
import { activeFamily, groupByFamily } from "../lib/quality-utils";
import type { MenuInstance } from "../lib/vidstack";
import {
  DefaultMenuButton,
  DefaultMenuRadioGroup,
  Menu,
  useVideoQualityOptions,
} from "../lib/vidstack";

const FORMAT_OPTIONS: { label: string; value: "H.264" | "VP9" }[] = [
  { label: "H.264", value: "H.264" },
  { label: "VP9", value: "VP9" },
];

export function FormatSelector() {
  const menuRef = useRef<MenuInstance>(null);
  const options = useVideoQualityOptions({ sort: "descending" });

  const videoOptions = options.filter((o) => o.quality !== null);
  const groups = groupByFamily(videoOptions);

  if (groups.size <= 1) return null;

  const current = activeFamily(videoOptions) ?? "H.264";
  const availableOptions = FORMAT_OPTIONS.filter((f) => groups.has(f.value));

  function onChange(value: string) {
    const best = groups.get(value as "H.264" | "VP9");
    if (best) best.select();
    menuRef.current?.close();
  }

  return (
    <Menu.Root ref={menuRef} className="vds-format-menu vds-menu">
      <DefaultMenuButton label="Format" hint={current} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={current} options={availableOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}
