import { useRef } from "react";
import type { DefaultLayoutIcon, MenuInstance } from "../lib/vidstack";
import {
  DefaultMenuButton,
  DefaultMenuRadioGroup,
  LanguageIcon,
  Menu,
  useAudioOptions,
} from "../lib/vidstack";
import { includesOriginal, normalizeLanguageTag } from "./player-language";

const languageIcon: DefaultLayoutIcon = (props) => <LanguageIcon {...props} />;
const MENU_ITEMS_CLASS =
  "vds-menu-items overflow-y-auto overscroll-y-contain pr-0.5 [scrollbar-width:thin] [scrollbar-color:var(--color-zinc-500)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-soft/80 [&::-webkit-scrollbar-thumb:hover]:bg-surface-soft [&::-webkit-scrollbar-track]:bg-transparent";

type Props = {
  originalLocale?: string | null;
};

export function AudioTrackSelector({ originalLocale }: Props) {
  const menuRef = useRef<MenuInstance>(null);
  const options = useAudioOptions();

  if (options.length <= 1) return null;

  const selectedOption = options.find((o) => o.selected) ?? options[0];
  const selectedTrackLooksOriginal = includesOriginal(selectedOption?.label);
  const selectedMatchesOriginalLocale =
    originalLocale != null &&
    normalizeLanguageTag(selectedOption?.track.language) === normalizeLanguageTag(originalLocale);
  const selectedIsOriginal = selectedTrackLooksOriginal || selectedMatchesOriginalLocale;
  const currentHint = selectedIsOriginal
    ? `${selectedOption?.label} (original)`
    : selectedOption?.label;

  const radioOptions = options.map((o, index) => {
    const isOriginal =
      includesOriginal(o.label) ||
      (originalLocale != null &&
        normalizeLanguageTag(o.track.language) === normalizeLanguageTag(originalLocale));
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
      <Menu.Items className={MENU_ITEMS_CLASS}>
        <DefaultMenuRadioGroup value={selectedValue} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}
