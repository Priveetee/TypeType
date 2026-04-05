import type {
  RecommendationOnboardingStateResponse,
  RecommendationOnboardingTopicsResponse,
} from "../types/api";
import { useOnboardingChannelAvatars } from "./use-onboarding-channel-avatars";
import { useOnboardingChannelSearch } from "./use-onboarding-channel-search";
import { useOnboardingWorkflowActions } from "./use-onboarding-workflow-actions";
import { useOnboardingWorkflowState } from "./use-onboarding-workflow-state";
import type { useRecommendationOnboardingActions } from "./use-recommendation-onboarding";
import { useSubscriptions } from "./use-subscriptions";

type Params = {
  state: RecommendationOnboardingStateResponse | undefined;
  topics: RecommendationOnboardingTopicsResponse | undefined;
  actions: ReturnType<typeof useRecommendationOnboardingActions>;
};

export function useOnboardingWorkflow({ state, topics, actions }: Params) {
  const flowState = useOnboardingWorkflowState({ state, topics });
  const subscriptions = useSubscriptions();
  const channelSearch = useOnboardingChannelSearch(flowState.channelQuery, 0);
  const minTopics = topics?.minTopics ?? 3;

  const flowActions = useOnboardingWorkflowActions({
    state,
    minTopics,
    selectedTopics: flowState.selectedTopics,
    selectedChannels: flowState.selectedChannels,
    actions,
    setError: flowState.setError,
    setToast: flowState.setToast,
  });

  const suggestedChannels = (subscriptions.query.data ?? []).slice(0, 12);
  const channelsForAvatarHydration = [
    ...suggestedChannels.map((channel) => ({
      channelUrl: channel.channelUrl,
      avatarUrl: channel.avatarUrl,
    })),
    ...((channelSearch.data ?? []).map((channel) => ({
      channelUrl: channel.channelUrl,
      avatarUrl: channel.avatarUrl,
    })) ?? []),
  ];
  const hydratedAvatars = useOnboardingChannelAvatars(channelsForAvatarHydration);

  const suggestedWithHydratedAvatars = suggestedChannels.map((channel) => ({
    ...channel,
    avatarUrl: hydratedAvatars.byChannelUrl[channel.channelUrl] ?? channel.avatarUrl,
  }));

  const searchedWithHydratedAvatars = (channelSearch.data ?? []).map((channel) => ({
    ...channel,
    avatarUrl: hydratedAvatars.byChannelUrl[channel.channelUrl] ?? channel.avatarUrl,
  }));
  const canNext = flowState.selectedTopics.length >= minTopics;
  const canFinish = flowState.selectedTopics.length >= minTopics;

  function addChannelFromCandidate(candidate: { channelUrl: string }) {
    flowState.addChannelUrl(candidate.channelUrl);
  }

  return {
    ...flowState,
    ...flowActions,
    suggestedChannels: suggestedWithHydratedAvatars,
    searchedChannels: searchedWithHydratedAvatars,
    canNext,
    canFinish,
    suggestionsLoading: subscriptions.query.isLoading,
    searchLoading: channelSearch.isLoading,
    avatarResolving: hydratedAvatars.resolving,
    addChannelFromCandidate,
  };
}
