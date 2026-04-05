import type { RecommendationOnboardingTopicsResponse } from "../types/api";

type Props = {
  topics: RecommendationOnboardingTopicsResponse | undefined;
  selectedTopics: string[];
  activeGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onToggleTopic: (topic: string) => void;
};

export function OnboardingInterestsStep({
  topics,
  selectedTopics,
  activeGroupId,
  onSelectGroup,
  onToggleTopic,
}: Props) {
  const minTopics = topics?.minTopics ?? 3;
  const selectedTopicKeys = new Set(selectedTopics.map((topic) => topic.toLowerCase()));
  const activeGroup =
    topics?.groups.find((group) => group.id === activeGroupId) ?? topics?.groups[0];

  return (
    <section className="flex flex-col gap-5">
      <div className="border-b border-zinc-800 pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          Step 1 - Interests
        </p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-100">What should we prioritize?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Pick at least {minTopics} topics. You can change this later in settings.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Selected topics</p>
        <p className="text-xs text-zinc-400">
          <span className="font-semibold text-zinc-100">{selectedTopics.length}</span>
          {` / ${minTopics} minimum`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics?.groups.map((group) => {
          const selected = group.id === activeGroup?.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelectGroup(group.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                selected
                  ? "border-zinc-200 bg-zinc-100 text-zinc-900"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div className="flex flex-wrap gap-2">
          {activeGroup.topics.map((topic) => {
            const selected = selectedTopicKeys.has(topic.toLowerCase());
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onToggleTopic(topic)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selected
                    ? "border-zinc-200 bg-zinc-100 text-zinc-900"
                    : "border-zinc-700 text-zinc-200 hover:border-zinc-500"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
