import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ServiceId = 0 | 5 | 6;

type ServiceStore = {
  service: ServiceId;
  setService: (service: ServiceId) => void;
};

export const useServiceStore = create<ServiceStore>()(
  persist(
    (set) => ({
      service: 0,
      setService: (service) => set({ service }),
    }),
    { name: "typed-service" },
  ),
);
