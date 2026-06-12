import type { SponsorBlockSegmentItem } from "../types/api";
import type { SettingsItem, SponsorBlockCategoryAction } from "../types/user";

export type SponsorBlockCategory = {
  id: string;
  label: string;
  description: string;
  color: string;
  defaultAction: SponsorBlockCategoryAction;
};

export const SPONSORBLOCK_CATEGORIES: SponsorBlockCategory[] = [
  {
    id: "sponsor",
    label: "Sponsored message",
    description: "Paid promotion, sponsorship, or direct advertising.",
    color: "#00d400",
    defaultAction: "auto_skip",
  },
  {
    id: "selfpromo",
    label: "Self-promotion",
    description: "Unpaid promotion, merch, donations, or guest promotion.",
    color: "#ffff00",
    defaultAction: "auto_skip",
  },
  {
    id: "exclusive_access",
    label: "Exclusive access",
    description: "Whole-video labels for free or subsidized access.",
    color: "#008a5c",
    defaultAction: "mark_only",
  },
  {
    id: "interaction",
    label: "Interaction reminder",
    description: "Short reminders to like, subscribe, or follow.",
    color: "#cc00ff",
    defaultAction: "auto_skip",
  },
  {
    id: "poi_highlight",
    label: "Highlight",
    description: "The main point most viewers are looking for.",
    color: "#ff1684",
    defaultAction: "mark_only",
  },
  {
    id: "intro",
    label: "Intermission or intro",
    description: "Low-content pauses, static screens, or repeated animations.",
    color: "#00ffff",
    defaultAction: "auto_skip",
  },
  {
    id: "outro",
    label: "Endcards or credits",
    description: "Credits or YouTube end screens without useful conclusions.",
    color: "#0202ed",
    defaultAction: "auto_skip",
  },
  {
    id: "preview",
    label: "Preview or recap",
    description: "Clips repeated later in the same video or series.",
    color: "#008fd6",
    defaultAction: "auto_skip",
  },
  {
    id: "filler",
    label: "Tangents or jokes",
    description: "Aggressive skipping for non-essential tangents or jokes.",
    color: "#7300ff",
    defaultAction: "auto_skip",
  },
  {
    id: "chapter",
    label: "Chapter",
    description: "Custom chapters describing important sections.",
    color: "#ffd000",
    defaultAction: "mark_only",
  },
  {
    id: "music_offtopic",
    label: "Music: non-music",
    description: "Non-musical sections in music videos.",
    color: "#ff9900",
    defaultAction: "auto_skip",
  },
];

export const DEFAULT_SPONSORBLOCK_CATEGORY_ACTIONS = Object.fromEntries(
  SPONSORBLOCK_CATEGORIES.map((category) => [category.id, category.defaultAction]),
);

export function getSponsorBlockCategoryColor(categoryId: string) {
  return SPONSORBLOCK_CATEGORIES.find((category) => category.id === categoryId)?.color;
}

export function getSponsorBlockCategoryLabel(categoryId: string) {
  return (
    SPONSORBLOCK_CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId
  );
}

function isMusicVideo(category: string | undefined) {
  return category?.toLowerCase() === "music";
}

function isFullVideoSponsorBlockSegment(segment: SponsorBlockSegmentItem, duration: number) {
  if (duration <= 0) return false;
  return (
    getSponsorBlockStartTime(segment, duration) <= 5 &&
    getSponsorBlockEndTime(segment, duration) >= duration * 0.9
  );
}

export function getSponsorBlockStartTime(segment: SponsorBlockSegmentItem, duration: number) {
  return shouldNormalizeMilliseconds(segment, duration)
    ? segment.startTime / 1000
    : segment.startTime;
}

export function getSponsorBlockEndTime(segment: SponsorBlockSegmentItem, duration: number) {
  return shouldNormalizeMilliseconds(segment, duration) ? segment.endTime / 1000 : segment.endTime;
}

function shouldNormalizeMilliseconds(segment: SponsorBlockSegmentItem, duration: number) {
  return duration > 0 && segment.endTime > duration + 30;
}

export function filterSponsorBlockSegments(
  segments: SponsorBlockSegmentItem[] | undefined,
  settings: SettingsItem,
  duration: number,
) {
  if (!segments || settings.sponsorBlockMode === "disabled") return undefined;
  const minimumSeconds = Math.max(0, settings.sponsorBlockMinimumDuration);
  const visible = segments.filter((segment) => {
    const action = settings.sponsorBlockCategoryActions[segment.category] ?? "mark_only";
    const segmentDuration =
      getSponsorBlockEndTime(segment, duration) - getSponsorBlockStartTime(segment, duration);
    if (action === "disabled" || segmentDuration < minimumSeconds) return false;
    return (
      settings.sponsorBlockShowFullVideoLabels || !isFullVideoSponsorBlockSegment(segment, duration)
    );
  });
  return visible.length > 0 ? visible : undefined;
}

export function filterAutoSkipSponsorBlockSegments(
  segments: SponsorBlockSegmentItem[] | undefined,
  settings: SettingsItem,
  duration: number,
  streamCategory: string | undefined,
) {
  if (!segments || settings.sponsorBlockMode !== "auto_skip") return undefined;
  const skipped = segments.filter((segment) => {
    if (settings.sponsorBlockCategoryActions[segment.category] !== "auto_skip") return false;
    if (
      settings.sponsorBlockManualSkipOnFullVideo &&
      isFullVideoSponsorBlockSegment(segment, duration)
    ) {
      return false;
    }
    if (segment.category !== "music_offtopic") return true;
    return !settings.sponsorBlockSkipNonMusicOnlyOnMusicVideos || isMusicVideo(streamCategory);
  });
  return skipped.length > 0 ? skipped : undefined;
}

export function filterManualSponsorBlockSegments(
  segments: SponsorBlockSegmentItem[] | undefined,
  settings: SettingsItem,
  duration: number,
) {
  if (!segments || !settings.sponsorBlockManualSkipOnFullVideo) return undefined;
  const manual = segments.filter((segment) => isFullVideoSponsorBlockSegment(segment, duration));
  return manual.length > 0 ? manual : undefined;
}
