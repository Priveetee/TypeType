import { useEffect, useMemo, useState } from "react";
import { resolveChannelAvatar } from "../lib/channel-avatar-resolver";

type ChannelInput = {
  channelUrl: string;
  avatarUrl: string;
};

export function useOnboardingChannelAvatars(channels: ChannelInput[]) {
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [resolvingCount, setResolvingCount] = useState(0);

  const normalized = useMemo(
    () => channels.filter((channel) => channel.channelUrl.trim().length > 0),
    [channels],
  );

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const directMap: Record<string, string> = {};
      const pendingUrls: string[] = [];

      for (const channel of normalized) {
        const key = channel.channelUrl;
        const direct = channel.avatarUrl.trim();
        if (direct) {
          directMap[key] = direct;
          continue;
        }
        pendingUrls.push(key);
      }

      if (Object.keys(directMap).length > 0) {
        setAvatars((current) => ({ ...current, ...directMap }));
      }

      if (pendingUrls.length === 0) return;

      setResolvingCount(pendingUrls.length);

      const resolved = await Promise.all(
        pendingUrls.map(async (channelUrl) => ({
          channelUrl,
          avatarUrl: await resolveChannelAvatar(channelUrl),
        })),
      );

      if (!active) return;

      const resolvedMap: Record<string, string> = {};
      for (const item of resolved) {
        if (!item.avatarUrl) continue;
        resolvedMap[item.channelUrl] = item.avatarUrl;
      }
      if (Object.keys(resolvedMap).length > 0) {
        setAvatars((current) => ({ ...current, ...resolvedMap }));
      }
      setResolvingCount(0);
    }

    void hydrate();

    return () => {
      active = false;
      setResolvingCount(0);
    };
  }, [normalized]);

  return {
    byChannelUrl: avatars,
    resolving: resolvingCount > 0,
  };
}
