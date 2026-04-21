import type { SearchHistoryItem } from "../types/user";

export type SearchOverlayItem = {
  key: string;
  label: string;
  source: "history" | "suggestion";
};

const LIMIT = 10;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function dedupeItems(items: SearchOverlayItem[]): SearchOverlayItem[] {
  const result: SearchOverlayItem[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const id = normalize(item.label);
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(item);
    if (result.length >= LIMIT) break;
  }
  return result;
}

export function buildSearchOverlayItems(
  query: string,
  historyItems: SearchHistoryItem[],
  suggestions: string[],
): SearchOverlayItem[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return historyItems.map((item) => ({ key: item.id, label: item.term, source: "history" }));
  }
  const normalized = normalize(trimmed);
  const historyMatches = historyItems
    .filter((item) => normalize(item.term).startsWith(normalized))
    .map((item) => ({ key: `h-${item.id}`, label: item.term, source: "history" as const }));
  const suggestionItems = suggestions.map((term, index) => ({
    key: `s-${normalize(term)}-${index}`,
    label: term,
    source: "suggestion" as const,
  }));
  return dedupeItems([...historyMatches, ...suggestionItems]);
}
