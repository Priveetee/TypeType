import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeRecommendationOnboarding,
  fetchRecommendationOnboardingState,
  fetchRecommendationOnboardingTopics,
  reapplyRecommendationOnboarding,
  saveRecommendationOnboardingPreferences,
  skipRecommendationOnboarding,
} from "../lib/api-recommendations";

const ONBOARDING_STATE_KEY = ["recommendation-onboarding-state"];
const ONBOARDING_TOPICS_KEY = ["recommendation-onboarding-topics"];

function normalizeValues(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

export function useRecommendationOnboardingState(enabled: boolean) {
  return useQuery({
    queryKey: ONBOARDING_STATE_KEY,
    queryFn: () => fetchRecommendationOnboardingState(),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useRecommendationOnboardingTopics(enabled: boolean) {
  return useQuery({
    queryKey: ONBOARDING_TOPICS_KEY,
    queryFn: () => fetchRecommendationOnboardingTopics(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecommendationOnboardingActions() {
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: (payload: { selectedTopics: string[]; selectedChannels: string[] }) =>
      saveRecommendationOnboardingPreferences({
        selectedTopics: normalizeValues(payload.selectedTopics),
        selectedChannels: normalizeValues(payload.selectedChannels),
      }),
    onSuccess: (state) => {
      queryClient.setQueryData(ONBOARDING_STATE_KEY, state);
    },
  });

  const complete = useMutation({
    mutationFn: () => completeRecommendationOnboarding(),
    onSuccess: (state) => {
      queryClient.setQueryData(ONBOARDING_STATE_KEY, state);
    },
  });

  const skip = useMutation({
    mutationFn: () => skipRecommendationOnboarding(),
    onSuccess: (state) => {
      queryClient.setQueryData(ONBOARDING_STATE_KEY, state);
    },
  });

  const reapply = useMutation({
    mutationFn: () => reapplyRecommendationOnboarding(),
    onSuccess: (state) => {
      queryClient.setQueryData(ONBOARDING_STATE_KEY, state);
    },
  });

  return { save, complete, skip, reapply };
}
