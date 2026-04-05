import { create } from "zustand";

type ShortsFeedbackState = {
  hiddenVideoIds: string[];
  hiddenChannelUrls: string[];
  hideVideo: (videoUrl: string) => void;
  hideChannel: (channelUrl: string) => void;
  reset: () => void;
};

export const useShortsFeedbackStore = create<ShortsFeedbackState>((set) => ({
  hiddenVideoIds: [],
  hiddenChannelUrls: [],
  hideVideo: (videoUrl) =>
    set((state) => {
      if (state.hiddenVideoIds.includes(videoUrl)) return state;
      return { hiddenVideoIds: [...state.hiddenVideoIds, videoUrl] };
    }),
  hideChannel: (channelUrl) =>
    set((state) => {
      if (state.hiddenChannelUrls.includes(channelUrl)) return state;
      return { hiddenChannelUrls: [...state.hiddenChannelUrls, channelUrl] };
    }),
  reset: () => set({ hiddenVideoIds: [], hiddenChannelUrls: [] }),
}));
