import { useRef } from "react";
import { activeFamily, codecFamily } from "../lib/quality-utils";
import type { DefaultLayoutIcon, MenuInstance } from "../lib/vidstack";
import {
  ClipIcon,
  DefaultMenuButton,
  DefaultMenuRadioGroup,
  Menu,
  useVideoQualityOptions,
} from "../lib/vidstack";

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
  if (filteredOptions.every((o) => (o.quality?.height ?? 0) === 0)) return null;

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
