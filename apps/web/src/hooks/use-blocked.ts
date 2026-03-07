import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockChannel,
  blockVideo,
  fetchBlockedChannels,
  fetchBlockedVideos,
  unblockChannel,
  unblockVideo,
} from "../lib/api-collections";

const CHANNELS_KEY = ["blocked-channels"];
const VIDEOS_KEY = ["blocked-videos"];

export function useBlocked() {
  const qc = useQueryClient();

  const channels = useQuery({ queryKey: CHANNELS_KEY, queryFn: fetchBlockedChannels });
  const videos = useQuery({ queryKey: VIDEOS_KEY, queryFn: fetchBlockedVideos });

  const addChannel = useMutation({
    mutationFn: (url: string) => blockChannel(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHANNELS_KEY }),
  });

  const removeChannel = useMutation({
    mutationFn: (url: string) => unblockChannel(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHANNELS_KEY }),
  });

  const addVideo = useMutation({
    mutationFn: (url: string) => blockVideo(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: VIDEOS_KEY }),
  });

  const removeVideo = useMutation({
    mutationFn: (url: string) => unblockVideo(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: VIDEOS_KEY }),
  });

  return { channels, videos, addChannel, removeChannel, addVideo, removeVideo };
}
