import type { MenuInstance } from "@vidstack/react";
import { Menu, useVideoQualityOptions } from "@vidstack/react";
import { ClipIcon } from "@vidstack/react/icons";
import type { DefaultLayoutIcon } from "@vidstack/react/player/layouts/default";
import { DefaultMenuButton, DefaultMenuRadioGroup } from "@vidstack/react/player/layouts/default";
import { useRef } from "react";
import { activeFamily, codecFamily } from "../lib/quality-utils";

const qualityIcon: DefaultLayoutIcon = (props) => <ClipIcon {...props} />;

export function QualitySelector() {
  const menuRef = useRef<MenuInstance>(null);
  const options = useVideoQualityOptions({ sort: "descending" });

  const videoOptions = options.filter((o) => o.quality !== null);
  const family = activeFamily(videoOptions);

  const filteredOptions = videoOptions.filter(
    (o) => o.quality !== null && codecFamily(o.quality.codec) === family,
  );

  if (filteredOptions.length <= 1) return null;

  const current = filteredOptions.find((o) => o.selected)?.label ?? filteredOptions[0]?.label;

  const radioOptions = filteredOptions.map((o) => ({ label: o.label, value: o.label }));

  function onChange(value: string) {
    filteredOptions.find((o) => o.label === value)?.select();
    menuRef.current?.close();
  }

  return (
    <Menu.Root ref={menuRef} className="vds-quality-menu vds-menu">
      <DefaultMenuButton label="Quality" hint={current} Icon={qualityIcon} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={current ?? ""} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}
