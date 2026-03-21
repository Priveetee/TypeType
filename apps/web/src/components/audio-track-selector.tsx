import type { MenuInstance } from "@vidstack/react";
import { Menu, useAudioOptions } from "@vidstack/react";
import { LanguageIcon } from "@vidstack/react/icons";
import type { DefaultLayoutIcon } from "@vidstack/react/player/layouts/default";
import { DefaultMenuButton, DefaultMenuRadioGroup } from "@vidstack/react/player/layouts/default";
import { useRef } from "react";

const languageIcon: DefaultLayoutIcon = (props) => <LanguageIcon {...props} />;

type Props = {
  originalLocale?: string | null;
};

export function AudioTrackSelector({ originalLocale }: Props) {
  const menuRef = useRef<MenuInstance>(null);
  const options = useAudioOptions();

  if (options.length <= 1) return null;

  const selectedOption = options.find((o) => o.selected) ?? options[0];
  const selectedIsOriginal =
    originalLocale != null && selectedOption?.track.language === originalLocale;
  const currentHint = selectedIsOriginal
    ? `${selectedOption?.label} (original)`
    : selectedOption?.label;

  const radioOptions = options.map((o, index) => {
    const isOriginal = originalLocale != null && o.track.language === originalLocale;
    return {
      label: isOriginal ? `${o.label} (original)` : o.label,
      value: `${o.label}-${o.track.language ?? "und"}-${index}`,
    };
  });

  const selectedValue =
    radioOptions.find((_, index) => options[index]?.selected)?.value ??
    radioOptions[0]?.value ??
    "";

  function onChange(value: string) {
    const selectedIndex = radioOptions.findIndex((option) => option.value === value);
    options[selectedIndex]?.select();
    menuRef.current?.close();
  }

  return (
    <Menu.Root ref={menuRef} className="vds-audio-menu vds-menu">
      <DefaultMenuButton label="Language" hint={currentHint} Icon={languageIcon} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={selectedValue} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}
