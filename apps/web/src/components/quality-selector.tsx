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
const MENU_ITEMS_CLASS =
  "vds-menu-items overflow-y-auto overscroll-y-contain pr-0.5 [scrollbar-width:thin] [scrollbar-color:var(--color-zinc-500)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-soft/80 [&::-webkit-scrollbar-thumb:hover]:bg-surface-soft [&::-webkit-scrollbar-track]:bg-transparent";

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
      <Menu.Items className={MENU_ITEMS_CLASS}>
        <DefaultMenuRadioGroup value={current ?? ""} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}
