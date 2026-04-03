import type { DefaultLayoutIcon } from "../lib/vidstack";
import { DefaultMenuButton, DefaultMenuRadioGroup, Menu, OdometerIcon } from "../lib/vidstack";

const sizeIcon: DefaultLayoutIcon = (props) => <OdometerIcon {...props} />;

type FontSize = "small" | "normal" | "large" | "huge";

const SIZE_OPTIONS: { label: string; value: FontSize; multiplier: number }[] = [
  { label: "Small", value: "small", multiplier: 0.75 },
  { label: "Normal", value: "normal", multiplier: 1 },
  { label: "Large", value: "large", multiplier: 1.5 },
  { label: "Huge", value: "huge", multiplier: 2 },
];

type Props = {
  value: FontSize;
  onChange: (size: FontSize) => void;
};

export type { FontSize };

export function SubtitleSizeSelector({ value, onChange }: Props) {
  const current = SIZE_OPTIONS.find((o) => o.value === value) ?? SIZE_OPTIONS[1];

  const radioOptions = SIZE_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  function onSelect(selected: string) {
    onChange(selected as FontSize);
  }

  return (
    <Menu.Root className="vds-font-size-menu vds-menu">
      <DefaultMenuButton label="Subtitle Size" hint={current.label} Icon={sizeIcon} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={value} options={radioOptions} onChange={onSelect} />
      </Menu.Items>
    </Menu.Root>
  );
}

export function fontSizeToMultiplier(size: FontSize): number {
  return SIZE_OPTIONS.find((o) => o.value === size)?.multiplier ?? 1;
}
