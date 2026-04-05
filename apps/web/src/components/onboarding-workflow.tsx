import { useOnboardingWorkflow } from "../hooks/use-onboarding-workflow";
import type { useRecommendationOnboardingActions } from "../hooks/use-recommendation-onboarding";
import type {
  RecommendationOnboardingStateResponse,
  RecommendationOnboardingTopicsResponse,
} from "../types/api";
import { OnboardingActions } from "./onboarding-actions";
import { OnboardingChannelsStep } from "./onboarding-channels-step";
import { OnboardingHeader } from "./onboarding-header";
import { OnboardingInterestsStep } from "./onboarding-interests-step";
import { Toast } from "./toast";

type Props = {
  state: RecommendationOnboardingStateResponse | undefined;
  topics: RecommendationOnboardingTopicsResponse | undefined;
  actions: ReturnType<typeof useRecommendationOnboardingActions>;
  mode?: "onboarding" | "settings";
};

export function OnboardingWorkflow({ state, topics, actions, mode = "onboarding" }: Props) {
  const flow = useOnboardingWorkflow({ state, topics, actions });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-7 pt-8 pb-8 [animation:page-fade-in_0.2s_ease-out]">
      <Toast message={flow.toast} />
      <OnboardingHeader mode={mode} step={flow.step} />

      {flow.step === 0 && (
        <div key="step-interests" className="[animation:onboarding-step-enter_0.26s_ease-out]">
          <OnboardingInterestsStep
            topics={topics}
            selectedTopics={flow.selectedTopics}
            activeGroupId={flow.activeGroupId}
            onSelectGroup={flow.setActiveGroupId}
            onToggleTopic={flow.toggleTopic}
          />
        </div>
      )}

      {flow.step === 1 && (
        <div key="step-channels" className="[animation:onboarding-step-enter_0.26s_ease-out]">
          <OnboardingChannelsStep
            channelQuery={flow.channelQuery}
            selectedChannels={flow.selectedChannels}
            suggestedChannels={flow.suggestedChannels}
            searchedChannels={flow.searchedChannels}
            suggestionsLoading={flow.suggestionsLoading}
            searchLoading={flow.searchLoading}
            avatarResolving={flow.avatarResolving}
            onChangeQuery={flow.setChannelQuery}
            onRemoveChannel={flow.removeChannel}
            onSelectSuggestion={flow.toggleSuggestedChannel}
            onSelectSearched={flow.addChannelFromCandidate}
          />
        </div>
      )}

      {flow.error && <p className="text-sm text-red-400">{flow.error}</p>}

      <OnboardingActions
        currentStep={flow.step}
        canNext={flow.canNext}
        canFinish={flow.canFinish}
        pending={flow.pending}
        mode={mode}
        onBack={() => flow.setStep((current) => Math.max(0, current - 1))}
        onSkip={() => void flow.skip()}
        onSave={() => void flow.saveAndReapply()}
        onNext={() => flow.setStep(1)}
        onFinish={() => void flow.complete()}
      />
    </div>
  );
}
