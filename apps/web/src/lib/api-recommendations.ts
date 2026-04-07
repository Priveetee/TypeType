import type {
  HomeRecommendationsResponse,
  RecommendationOnboardingStateResponse,
  RecommendationOnboardingTopicsResponse,
} from "../types/api";
import { authedJson } from "./authed";
import { API_BASE as BASE } from "./env";

export type RecommendationIntent = "quick" | "deep" | "auto";

export async function fetchHomeRecommendations(
  service: number,
  limit: number,
  cursor?: string,
  intent: RecommendationIntent = "auto",
): Promise<HomeRecommendationsResponse> {
  const search = new URLSearchParams({
    service: String(service),
    limit: String(limit),
    intent,
  });
  if (cursor) search.set("cursor", cursor);
  return authedJson(`${BASE}/recommendations/home?${search.toString()}`);
}

export async function fetchShortsRecommendations(
  service: number,
  limit: number,
  cursor?: string,
  intent: RecommendationIntent = "quick",
): Promise<HomeRecommendationsResponse> {
  const search = new URLSearchParams({
    service: String(service),
    limit: String(limit),
    intent,
  });
  if (cursor) search.set("cursor", cursor);
  return authedJson(`${BASE}/recommendations/shorts?${search.toString()}`);
}

type RecommendationOnboardingPreferencesRequest = {
  selectedTopics: string[];
  selectedChannels: string[];
};

export async function fetchRecommendationOnboardingTopics(): Promise<RecommendationOnboardingTopicsResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/topics`);
}

export async function fetchRecommendationOnboardingState(): Promise<RecommendationOnboardingStateResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/state`);
}

export async function saveRecommendationOnboardingPreferences(
  payload: RecommendationOnboardingPreferencesRequest,
): Promise<RecommendationOnboardingStateResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function completeRecommendationOnboarding(): Promise<RecommendationOnboardingStateResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/complete`, { method: "POST" });
}

export async function skipRecommendationOnboarding(): Promise<RecommendationOnboardingStateResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/skip`, { method: "POST" });
}

export async function reapplyRecommendationOnboarding(): Promise<RecommendationOnboardingStateResponse> {
  return authedJson(`${BASE}/recommendations/onboarding/reapply`, { method: "POST" });
}
