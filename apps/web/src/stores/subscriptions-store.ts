import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Subscription = {
  channelUrl: string;
  name: string;
  avatarUrl: string;
};

type SubscriptionsStore = {
  subscriptions: Subscription[];
  subscribe: (sub: Subscription) => void;
  unsubscribe: (channelUrl: string) => void;
  unsubscribeAll: () => void;
  isSubscribed: (channelUrl: string) => boolean;
};

export const useSubscriptionsStore = create<SubscriptionsStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      subscribe: (sub) =>
        set((state) => {
          const exists = state.subscriptions.some((s) => s.channelUrl === sub.channelUrl);
          if (exists) return state;
          return { subscriptions: [...state.subscriptions, sub] };
        }),
      unsubscribe: (channelUrl) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.channelUrl !== channelUrl),
        })),
      unsubscribeAll: () => set({ subscriptions: [] }),
      isSubscribed: (channelUrl) => get().subscriptions.some((s) => s.channelUrl === channelUrl),
    }),
    { name: "typed-subscriptions" },
  ),
);
