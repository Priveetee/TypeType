import { goto } from "../lib/route-redirect";
import type { RecommendationOnboardingStateResponse } from "../types/api";
import type { useRecommendationOnboardingActions } from "./use-recommendation-onboarding";

type Params = {
  state: RecommendationOnboardingStateResponse | undefined;
  minTopics: number;
  selectedTopics: string[];
  selectedChannels: string[];
  actions: ReturnType<typeof useRecommendationOnboardingActions>;
  setError: (value: string | null) => void;
  setToast: (value: string | null) => void;
};

export function useOnboardingWorkflowActions({
  state,
  minTopics,
  selectedTopics,
  selectedChannels,
  actions,
  setError,
  setToast,
}: Params) {
  const pending =
    actions.save.isPending ||
    actions.complete.isPending ||
    actions.skip.isPending ||
    actions.reapply.isPending;

  async function savePreferences() {
    setError(null);
    try {
      await actions.save.mutateAsync({ selectedTopics, selectedChannels });
      setToast("Preferences saved");
    } catch {
      setError("Unable to save preferences.");
    }
  }

  async function saveAndReapply() {
    setError(null);
    try {
      await actions.save.mutateAsync({ selectedTopics, selectedChannels });
      if (state?.requiresOnboarding === false) {
        await actions.reapply.mutateAsync();
      }
      setToast("Preferences saved");
    } catch {
      setError("Unable to save preferences.");
    }
  }

  async function complete() {
    setError(null);
    if (selectedTopics.length < minTopics) {
      setError(`Select at least ${minTopics} topics before continuing.`);
      return;
    }
    try {
      await actions.save.mutateAsync({ selectedTopics, selectedChannels });
      await actions.complete.mutateAsync();
      setToast("Onboarding completed");
      window.location.replace("/");
    } catch {
      setError("Unable to complete onboarding.");
    }
  }

  async function skip() {
    setError(null);
    try {
      await actions.save.mutateAsync({ selectedTopics, selectedChannels });
      await actions.skip.mutateAsync();
      goto("/");
    } catch {
      setError("Unable to save your current choices.");
    }
  }

  return { pending, savePreferences, saveAndReapply, complete, skip };
}
