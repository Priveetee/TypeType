import type { HomeRecommendationMetricsResponse, HomeRecommendationsResponse } from "../types/api";
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

export async function fetchHomeRecommendationMetrics(
  service: number,
  clicked: string[],
): Promise<HomeRecommendationMetricsResponse> {
  const search = new URLSearchParams({ service: String(service) });
  if (clicked.length > 0) search.set("clicked", clicked.join(","));
  return authedJson(`${BASE}/recommendations/home/metrics?${search.toString()}`);
}
