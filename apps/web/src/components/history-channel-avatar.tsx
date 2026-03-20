import { useEffect, useState } from "react";
import { resolveHistoryAvatar } from "../lib/history-enrichment";
import { proxyImage } from "../lib/proxy";
import type { HistoryItem } from "../types/user";
import { ChannelAvatar } from "./channel-avatar";

type HistoryChannelAvatarProps = {
  item: HistoryItem;
  className: string;
};

export function HistoryChannelAvatar({ item, className }: HistoryChannelAvatarProps) {
  const [src, setSrc] = useState(item.channelAvatar ?? "");

  useEffect(() => {
    let active = true;
    setSrc(item.channelAvatar ?? "");
    if (item.channelAvatar)
      return () => {
        active = false;
      };
    resolveHistoryAvatar(item).then((avatarUrl) => {
      if (!active || !avatarUrl) return;
      setSrc(avatarUrl);
    });
    return () => {
      active = false;
    };
  }, [item]);

  return <ChannelAvatar src={proxyImage(src)} name={item.channelName} className={className} />;
}
