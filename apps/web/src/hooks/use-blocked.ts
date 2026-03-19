import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockChannel,
  blockVideo,
  fetchBlockedChannels,
  fetchBlockedVideos,
  unblockChannel,
  unblockVideo,
} from "../lib/api-collections";
import { useAuth } from "./use-auth";

const CHANNELS_KEY = ["blocked-channels"];
const VIDEOS_KEY = ["blocked-videos"];

type BlockChannelArgs = {
  url: string;
  name?: string;
  thumbnailUrl?: string;
  global?: boolean;
};

type BlockVideoArgs = {
  url: string;
  global?: boolean;
};

export function useBlocked() {
  const qc = useQueryClient();
  const { isAuthed } = useAuth();

  const channels = useQuery({
    queryKey: CHANNELS_KEY,
    queryFn: fetchBlockedChannels,
    enabled: isAuthed,
  });
  const videos = useQuery({ queryKey: VIDEOS_KEY, queryFn: fetchBlockedVideos, enabled: isAuthed });

  const addChannel = useMutation({
    mutationFn: ({ url, name, thumbnailUrl, global }: BlockChannelArgs) =>
      isAuthed ? blockChannel(url, name, thumbnailUrl, global) : Promise.resolve(),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHANNELS_KEY }),
  });

  const removeChannel = useMutation({
    mutationFn: (url: string) => (isAuthed ? unblockChannel(url) : Promise.resolve()),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHANNELS_KEY }),
  });

  const addVideo = useMutation({
    mutationFn: ({ url, global }: BlockVideoArgs) =>
      isAuthed ? blockVideo(url, global) : Promise.resolve(),
    onSuccess: () => qc.invalidateQueries({ queryKey: VIDEOS_KEY }),
  });

  const removeVideo = useMutation({
    mutationFn: (url: string) => (isAuthed ? unblockVideo(url) : Promise.resolve()),
    onSuccess: () => qc.invalidateQueries({ queryKey: VIDEOS_KEY }),
  });

  return { channels, videos, addChannel, removeChannel, addVideo, removeVideo };
}
