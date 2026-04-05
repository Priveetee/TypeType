import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../lib/api";
import { useDebouncedValue } from "./use-debounced-value";

export type OnboardingChannelCandidate = {
  channelUrl: string;
  name: string;
  avatarUrl: string;
};

function buildCandidates(
  items: { uploaderUrl: string; uploaderName: string; uploaderAvatarUrl: string }[],
): OnboardingChannelCandidate[] {
  const seen = new Set<string>();
  const out: OnboardingChannelCandidate[] = [];

  for (const item of items) {
    const channelUrl = item.uploaderUrl.trim();
    if (!channelUrl || seen.has(channelUrl)) continue;
    seen.add(channelUrl);
    out.push({
      channelUrl,
      name: item.uploaderName.trim() || channelUrl,
      avatarUrl: item.uploaderAvatarUrl.trim(),
    });
    if (out.length >= 12) break;
  }

  return out;
}

export function useOnboardingChannelSearch(query: string, service: number) {
  const debounced = useDebouncedValue(query.trim(), 260);
  const enabled = debounced.length >= 2;

  return useQuery({
    queryKey: ["onboarding-channel-search", service, debounced],
    enabled,
    queryFn: async () => {
      const page = await fetchSearch(debounced, service);
      return buildCandidates(page.items);
    },
    staleTime: 60 * 1000,
  });
}
