import { create } from "zustand";

export type SabrQualityOption = {
  itag: number;
  label: string;
  height: number;
};

type SabrQualityStore = {
  streamId: string | null;
  options: SabrQualityOption[];
  selectedItag: number | null;
  setOptions: (streamId: string, options: SabrQualityOption[], fallbackItag: number | null) => void;
  selectQuality: (streamId: string, itag: number) => void;
};

export const useSabrQualityStore = create<SabrQualityStore>((set) => ({
  streamId: null,
  options: [],
  selectedItag: null,
  setOptions: (streamId, options, fallbackItag) =>
    set((state) => {
      const selectedItag = state.streamId === streamId ? state.selectedItag : null;
      const selectedExists = options.some((option) => option.itag === selectedItag);
      return {
        streamId,
        options,
        selectedItag: selectedExists ? selectedItag : fallbackItag,
      };
    }),
  selectQuality: (streamId, itag) =>
    set((state) => (state.streamId === streamId ? { selectedItag: itag } : state)),
}));
